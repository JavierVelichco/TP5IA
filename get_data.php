<?php
header('Content-Type: application/json');

// 1. Conexión
$conexion = new mysqli("localhost", "root", "", "tp_final");

if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

// 2. Consulta
$sql = "SELECT id, nombre, puntos, x, y FROM puntajes ORDER BY puntos DESC LIMIT 20";
$resultado = $conexion->query($sql);

$datos = [];

while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

// 3. Respuesta JSON
echo json_encode($datos);
?>
