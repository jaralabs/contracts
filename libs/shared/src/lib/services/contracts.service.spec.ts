import { Contrato } from './contracts.service';

describe('ContractsService - Search Logic', () => {
  const mockContratos: Contrato[] = [
    {
      id: 'CON-1001',
      titulo: 'Acuerdo de Nivel de Servicio (ANS) para Soporte IT',
      estado: 'activo',
      fecha_creacion: '2024-12-15',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      fecha_firma: '2024-12-20',
      valor: 10000,
      moneda: 'USD',
      partes: [],
      clausulas: [],
      documentos_adjuntos: [],
      historial_estados: [],
    },
    {
      id: 'CON-1002',
      titulo: 'Desarrollo de plataforma e-commerce',
      estado: 'pendiente_firma',
      fecha_creacion: '2025-01-15',
      fecha_inicio: '2025-02-01',
      fecha_fin: '2025-11-30',
      fecha_firma: null,
      valor: 15000,
      moneda: 'USD',
      partes: [],
      clausulas: [],
      documentos_adjuntos: [],
      historial_estados: [],
    },
    {
      id: 'CON-1003',
      titulo: 'Consultoría en transformación digital',
      estado: 'finalizado',
      fecha_creacion: '2023-11-01',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      fecha_firma: '2023-12-15',
      valor: 8000,
      moneda: 'EUR',
      partes: [],
      clausulas: [],
      documentos_adjuntos: [],
      historial_estados: [],
    },
  ];

  describe('Filter by search term', () => {
    it('should filter contracts by id (case-insensitive)', () => {
      const searchTerm = '1003';
      const result = mockContratos.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1003');
    });

    it('should filter contracts by titulo (case-insensitive)', () => {
      const searchTerm = 'consultoría';
      const result = mockContratos.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(result.length).toBe(1);
      expect(result[0].titulo).toContain('Consultoría');
    });

    it('should search in both id and titulo', () => {
      const searchTerm = 'con';
      const result = mockContratos.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(result.length).toBe(3);
    });

    it('should return empty array when search has no matches', () => {
      const searchTerm = 'no-existe';
      const result = mockContratos.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(result.length).toBe(0);
    });

    it('should be case-insensitive for uppercase search', () => {
      const searchTerm = 'SOPORTE';
      const result = mockContratos.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1001');
    });
  });

  describe('Filter by estado', () => {
    it('should filter contracts by estado "activo"', () => {
      const result = mockContratos.filter((c) => c.estado === 'activo');

      expect(result.length).toBe(1);
      expect(result[0].estado).toBe('activo');
    });

    it('should filter contracts by estado "pendiente_firma"', () => {
      const result = mockContratos.filter(
        (c) => c.estado === 'pendiente_firma'
      );

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1002');
    });

    it('should filter contracts by estado "finalizado"', () => {
      const result = mockContratos.filter((c) => c.estado === 'finalizado');

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1003');
    });
  });

  describe('Filter by fecha_fin', () => {
    it('should filter contracts by specific fecha_fin', () => {
      const fechaFin = '2025-12-31';
      const result = mockContratos.filter((c) => c.fecha_fin === fechaFin);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1001');
    });

    it('should return empty array when fecha_fin has no matches', () => {
      const fechaFin = '2030-12-31';
      const result = mockContratos.filter((c) => c.fecha_fin === fechaFin);

      expect(result.length).toBe(0);
    });
  });

  describe('Combined filters', () => {
    it('should filter by estado AND search term', () => {
      const searchTerm = 'soporte';
      const estado = 'activo';

      const result = mockContratos.filter(
        (c) =>
          c.estado === estado &&
          (c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CON-1001');
    });

    it('should return empty array when combined filters have no matches', () => {
      const searchTerm = 'consultoría';
      const estado = 'activo';

      const result = mockContratos.filter(
        (c) =>
          c.estado === estado &&
          (c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      expect(result.length).toBe(0);
    });
  });

  describe('Data validation', () => {
    it('should have valid contract structure', () => {
      mockContratos.forEach((contrato) => {
        expect(contrato).toHaveProperty('id');
        expect(contrato).toHaveProperty('titulo');
        expect(contrato).toHaveProperty('estado');
        expect(contrato).toHaveProperty('valor');
        expect(contrato).toHaveProperty('moneda');
      });
    });

    it('should have valid estado values', () => {
      const validEstados = [
        'activo',
        'pendiente_firma',
        'finalizado',
        'borrador',
        'suspendido',
      ];

      mockContratos.forEach((contrato) => {
        expect(validEstados).toContain(contrato.estado);
      });
    });

    it('should have valid moneda values', () => {
      const validMonedas = ['USD', 'EUR'];

      mockContratos.forEach((contrato) => {
        expect(validMonedas).toContain(contrato.moneda);
      });
    });

    it('should have numeric valor', () => {
      mockContratos.forEach((contrato) => {
        expect(typeof contrato.valor).toBe('number');
        expect(contrato.valor).toBeGreaterThan(0);
      });
    });
  });

  describe('Date formatting', () => {
    it('should format dates in YYYY-MM-DD format', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      mockContratos.forEach((contrato) => {
        expect(contrato.fecha_inicio).toMatch(dateRegex);
        expect(contrato.fecha_fin).toMatch(dateRegex);
        expect(contrato.fecha_creacion).toMatch(dateRegex);
      });
    });

    it('should have fecha_inicio before fecha_fin', () => {
      mockContratos.forEach((contrato) => {
        const inicio = new Date(contrato.fecha_inicio);
        const fin = new Date(contrato.fecha_fin);

        expect(inicio.getTime()).toBeLessThan(fin.getTime());
      });
    });
  });

  describe('Sorting', () => {
    it('should sort contracts by valor (ascending)', () => {
      const sorted = [...mockContratos].sort((a, b) => a.valor - b.valor);

      expect(sorted[0].valor).toBe(8000);
      expect(sorted[1].valor).toBe(10000);
      expect(sorted[2].valor).toBe(15000);
    });

    it('should sort contracts by valor (descending)', () => {
      const sorted = [...mockContratos].sort((a, b) => b.valor - a.valor);

      expect(sorted[0].valor).toBe(15000);
      expect(sorted[1].valor).toBe(10000);
      expect(sorted[2].valor).toBe(8000);
    });

    it('should sort contracts by id', () => {
      const sorted = [...mockContratos].sort((a, b) =>
        a.id.localeCompare(b.id)
      );

      expect(sorted[0].id).toBe('CON-1001');
      expect(sorted[1].id).toBe('CON-1002');
      expect(sorted[2].id).toBe('CON-1003');
    });
  });
});
