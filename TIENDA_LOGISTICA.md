# Logística inicial de la tienda Campeach

Actualizado: 13 de agosto de 2026.

## Supuestos para fijar precios

- Cambio de protección: RD$60 por US$1 (por encima del mercado observado, alrededor de RD$58.50).
- Courier: RD$250 por libra, según el costo promedio indicado por Campeach.
- Delivery incluido: reserva de RD$500 por pedido. Si una zona cuesta más, se confirma antes del pago.
- Meta Ads: US$10 diarios = RD$600 diarios. El precio reserva RD$600 por venta, equivalente a una venta diaria.
- El margen restante cubre procesamiento de pago, cambios, garantía, variación del dólar y utilidad.
- Los precios de Walmart pueden cambiar. Confirmar costo e inventario antes de cobrar pedidos por encargo.

## Costeo recomendado

| Producto | Walmart | Peso | Compra a RD$60 | Courier | Ads | Delivery | Costo base | Precio web |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Clip & Camp 3 personas | US$30.93 | 5.64 lb | RD$1,856 | RD$1,410 | RD$600 | RD$500 | RD$4,366 | RD$5,990 |
| Clip & Camp 4 personas | US$41.26 | 7.87 lb | RD$2,476 | RD$1,968 | RD$600 | RD$500 | RD$5,544 | RD$7,490 |
| Clip & Camp 6 personas | US$82.00 | 14 lb | RD$4,920 | RD$3,500 | RD$600 | RD$500 | RD$9,520 | RD$12,490 |
| Clip & Camp 8 personas | US$112.00 | 23.81 lb | RD$6,720 | RD$5,953 | RD$600 | RD$500 | RD$13,773 | RD$17,990 |

El precio de 6 personas aparecía a US$69 en la captura, pero la ficha consultada posteriormente mostró US$82. Se usa US$82 para no vender con pérdida. Si vuelve a US$69, la diferencia debe conservarse como margen de seguridad o financiar una promoción limitada.

## Flujo operativo

1. El cliente selecciona el producto y envía el pedido prellenado por WhatsApp.
2. Campeach confirma inventario en Walmart, precio vigente y dirección del courier en Estados Unidos.
3. Se confirma cobertura del delivery local y plazo estimado.
4. Solo entonces se envía al cliente el enlace o instrucciones de pago.
5. Se compra en Walmart y se registra número de orden, producto, costo, peso previsto y cliente.
6. Al llegar al courier se compara peso facturado con peso publicado.
7. Al llegar a República Dominicana se inspecciona empaque, modelo y piezas antes del despacho.
8. Se coordina entrega y se conserva evidencia de recepción.

## Control mínimo de inventario

- Comenzar por encargo o con una unidad de 3, 4 y 6 personas.
- No acumular la de 8 personas hasta validar demanda: su flete consume mucho capital.
- Recalcular precios cuando el dólar cambie más de 3%, el courier cambie su tarifa o Walmart cambie más de US$5.
- Medir semanalmente: gasto publicitario, conversaciones, pedidos confirmados, ventas, costo por venta y margen real.
- Pausar anuncios si el costo por venta supera RD$600 durante siete días y revisar creativo/oferta.

## Política comercial inicial

- Publicar “delivery estándar incluido” y aclarar cobertura de hasta RD$500.
- No prometer entrega inmediata si el artículo se compra por encargo.
- Informar el plazo después de comprobar existencias.
- Definir por escrito cambios por defectos, piezas faltantes y productos ya utilizados antes de cobrar.

## Pasarela Pagadito

- Usar Pagadito WSPG desde el Cloudflare Worker. El `UID` y el `WSK` se guardan exclusivamente como secretos y nunca se incluyen en React, GitHub ni el navegador.
- Procesar los pedidos en pesos dominicanos (`DOP`).
- Sandbox: `https://sandbox.pagadito.com/comercios/wspg/charges.php`.
- Producción: `https://comercios.pagadito.com/wspg/charges.php`.
- Flujo: crear la orden en Campeach, solicitar a Pagadito una URL segura, redirigir al cliente y verificar el resultado mediante `get_status` antes de marcar la orden como pagada.
- Guardar por orden: producto, cantidad, cliente, entrega, total, estado, token de Pagadito y referencia de transacción.
- Activar producción únicamente después de completar una compra y un retorno exitosos en sandbox.
