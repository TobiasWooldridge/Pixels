function canvasToBlob(canvas) {
    var imageBase64 = canvas.toDataURL();
    var imageBinaryString = atob(imageBase64.split(',')[1]);
    var imageBinary = new Uint8Array(imageBinaryString.length);

    for (var i = 0; i < imageBinaryString.length; i++) {
        imageBinary[i] = imageBinaryString.charCodeAt(i);
    }

    return new Blob([new Uint8Array(imageBinary)], {type: 'image/png'});
}

function saveCanvasAsFile(canvas, filename) {
    var link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = filename;
    link.click();
}


//var form = new FormData();
//form.append("myNewFileName", file);
//$.ajax({
//    url: "uploadFile.php",
//    type: "POST",
//    data: form,
//    processData: false,
//    contentType: false
//}).done(function (respond) {
//    alert(respond);
//});
