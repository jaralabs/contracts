#!/bin/bash
# Script para generar iconos PWA placeholder usando ImageMagick
# Si no tienes ImageMagick, los iconos se pueden generar después con cualquier herramienta

# Colores del tema Genius Soft
BG_COLOR="#f97316"
TEXT_COLOR="#ffffff"

sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
  convert -size ${size}x${size} xc:"$BG_COLOR" \
    -gravity center \
    -pointsize $((size / 3)) \
    -fill "$TEXT_COLOR" \
    -font "DejaVu-Sans-Bold" \
    -annotate +0+0 "C" \
    icon-${size}x${size}.png 2>/dev/null || \
  echo "<!-- Icon ${size}x${size} placeholder -->" > icon-${size}x${size}.png.txt
done

echo "Iconos generados (o marcados para generación manual)"
