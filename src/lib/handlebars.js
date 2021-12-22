const moment = require('./moment');
const helpers = {};

helpers.deteLong = (fecha)=>{
    const newDate = new Date(fecha);
    return moment(fecha).format('dddd, DD MMMM YYYY');
    //return moment(fecha).format('LLLL');
}

helpers.fechaFile = (fecha)=>{
    const newDate = new Date(fecha);
    return moment(fecha).format('LLLL');
};

helpers.sizeFile = (size)=>{
    
    let sizeFile = Math.round(size/1000);

    return sizeFile+" KB";
};

helpers.atributoFile =  (extension,atributo)=>{
    let configFile =  helpers.configFile(extension);
    let attr;
    
    switch (atributo) {
        case "tipo":
            attr = configFile.tipo;
        break;
        case "icon":
            attr = configFile.icon;
            break;
        case "color":
            attr = configFile.color;
            break;
    }
    
    return attr;
}

helpers.configFile = (extension)=>{
    let configFile ={};
    switch (extension) {
        case ".txt":
            configFile ={
                            tipo:  "Documento de texto",
                            icon: "fa-file-alt",
                            color: "#999BB0;"
                        };
            break;
        case ".docx":
        case ".doc":
            
            configFile ={
                tipo:  "Documento de Microsoft Word",
                icon: "fa-file-word",
                color: "#0A1CD1;"
            };
            break;
        case ".xlsx":
        case ".xls":
            
            configFile ={
                tipo:  "Documento de Microsoft Excel",
                icon: "fa-file-excel",
                color: "#01782E;"
            };
            break;
        case ".pptx":
        case ".ppt":
            
            configFile ={
                tipo:  "Presentación de Microsoft PowerPoint",
                icon: "fa-file-powerpoint",
                color: "#CA3B0A;"
            };
            break;
        case ".pdf":
            
            configFile ={
                tipo:  "Documento Adobe Acrobat",
                icon: "fa-file-pdf",
                color: "#F81705;"
            };
            break;
        case ".jpg":
        case ".png":
        case ".gif":
        case ".tif":
            
            configFile ={
                tipo:  "Documento imagen",
                icon: "fa-file-image",
                color: "#DAF7A6;"
            };
            break;
        case "":
           
            configFile ={
                tipo:  "Carpeta de archivo",
                icon: "fa-folder",
                color: "#fcbb07;"
            };
            break;    
        default:
            
            configFile ={
                tipo:  "Sin identificar",
                icon: "fa-file",
                color: "#ffffff;"
            };
            break;
    }

    return configFile;
};


helpers.pathFile = (path, typeFile) => {
    let pathToFile ="";
    if(typeFile == "file"){
        pathToFile  = "/"+path;
        
    }

    if(typeFile == "directory"){
        pathToFile  = "/file-manager/"+path;
    }
    console.log(pathToFile);
    return pathToFile;
    
}

helpers.target = (typeFile) => {

    return typeFile == "directory" ? "": "_blank";

}





 
module.exports = helpers;