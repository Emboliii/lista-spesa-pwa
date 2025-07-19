<?php
$data = file_get_contents("php://input");

if(!$data){
    http_response_code(400);
    echo "Nessun dato ricevuto";
    exit;
}

$decoded = json_decode($data, true);

if(!is_array($decoded)){
    http_response_code(400);
    echo "Dati non validi";
    exit;
}

$file = 'liste.json';

$storico = [];
if(file_exists($file)){
    $storico = json_decode(file_get_contents(($file), true) ?: []);
}

$storico[] = [
    'data' => date("Y-m-d H:i:s"),
    'lista' => $decoded
];

file_put_contents($file, json_encode($storico, JSON_PRETTY_PRINT));

echo "Lista salvata nel file";

?>