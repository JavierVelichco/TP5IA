<?php
header('Content-Type: application/json; charset=utf-8');

// Conexión a la base (ajustá usuario/contraseña si los cambiaste)
$conexion = new mysqli("localhost", "root", "", "tp_final");

if ($conexion->connect_error) {
    echo json_encode(["ok" => false, "error" => "Error de conexión"]);
    exit;
}

// Leer datos enviados por POST
$name  = $_POST['name']  ?? '';
$money = $_POST['money'] ?? 0;
$month = $_POST['month'] ?? 0;

// Saneamos datos
$name  = $conexion->real_escape_string($name);
$money = (int)$money;
$month = (int)$month;

// Podés decidir cómo generar x e y; por ahora, algo simple:
$x = rand(50, 750);
$y = rand(80, 450);

// Insertar en tabla `puntajes` (ajustar nombres de columnas si difieren)
$sql = "INSERT INTO puntajes (nombre, puntos, x, y)
        VALUES ('$name', $money, $x, $y)";

if ($conexion->query($sql)) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => $conexion->error]);
}
