const {Router} = require('express');
const dirTree = require("directory-tree");
const { forEach } = require('p-iteration');
const fs = require('fs');
const path = require('path');
const CryptoJS = require("crypto-js");
const pathToRegex = require('path-to-regex');

const { capitalCase } = require('capital-case');

const router = Router();

const routeDynamic = new pathToRegex('/:path*');

function childTree(ruta){
    let item = {
        name:ruta.name, 
        path:ruta.path, 
        type:ruta.type,
        size:ruta.size,
        extension: ruta.type == "directory" ? "" : ruta.extension,
        
    };


    if(ruta.type == "directory" && ruta.children.length>0){
        
        let arrayChildrens = ruta.children;
        let arrayItems =[];
        for(let i in arrayChildrens){
            //console.log(arrayChildrens[i]);
            arrayItems.push({
                
                name:arrayChildrens[i].name, 
                path:arrayChildrens[i].path, 
                type:arrayChildrens[i].type,
                size:arrayChildrens[i].size,
                extension: arrayChildrens[i].type == "directory" ? "" : arrayChildrens[i].extension,
                link: arrayChildrens[i].type == "directory" ? "/"+arrayChildrens[i].name : arrayChildrens[i].name+"."+arrayChildrens[i].extension,
            });
        }

        console.log(arrayItems);

        Object.assign(item, {
            items: arrayItems
        });
        
    }

    return item;
        
}

function compararIndex(a, b) {
    return a.index - b.index;
}

function compararName(a, b) {
    if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
}


router.get('/file-manager/:path_directorio([a-z,0-9]*)?', function(req, res) {
    //const { url_paht ="" } = req.params;
    //res.send("Ok "+url_paht);

    //let raiz = "src/public/";}
    let raiz = path.join(__dirname,"../public/");
    const { path_directorio="" }= req.params;

    console.log(raiz,path_directorio); 
  
    let arrayPath = path_directorio.split("/");
    console.log(arrayPath);
    //raiz = raiz+path_directorio;
    console.log(raiz);
    const infoPath = dirTree(raiz+path_directorio,{attributes:["size", "type", "extension","mtime","mode"], extensions:/\.(pdf|xls|doc|xlsx|docx)$/});
    console.log(infoPath);
    
    let breadcrumb = [{path: "/file-manager", name:"Inicio"}];
    for(i in arrayPath){
        breadcrumb.push({path: breadcrumb[i].path+"/"+arrayPath[i], name:capitalCase(arrayPath[i])});
    }

    console.log(breadcrumb);
    
    let re = /\\/gi;
    let files = [];
    if(infoPath.children!=null){

        let arrayChildrens = infoPath.children;
        
        for(let i in arrayChildrens){
            //console.log(arrayChildrens[i]);
            if(!arrayChildrens[i].name.includes("~$")){
                files.push({
                
                    name:capitalCase(arrayChildrens[i].name), 
                    path:arrayChildrens[i].path.replace(re,"/").replace((raiz.replace(re,"/")),""), 
                    type:arrayChildrens[i].type,
                    size:arrayChildrens[i].size,
                    extension: arrayChildrens[i].type == "directory" ? "" : arrayChildrens[i].extension,
                    mtime:arrayChildrens[i].mtime,
                    index:arrayChildrens[i].type == "directory" ? 0 : 1,
                    
                });
            }
            
        }
        //console.log(files);
        console.log(files.sort(compararIndex));
        //console.log(files.sort(compararName));
        res.render('files',{files,breadcrumb});
    }//else{
       // console.log("Descaga archivo");
    //}

    
});


/*
router.get('/files', async (req, res) => {

    const raiz = "./src/public/";
    const directorio = "";
    //const directorio = req.params.path;
    console.log(raiz,directorio);
    const infoPath = dirTree(raiz+directorio,{attributes:["size", "type", "extension","mtime"]});

    console.log(infoPath);

    
    //let items=[];

    //items.push(await childTree(raiz));

    //console.log(items);
    
    //res.render('tree',{items});
    
});

router.get('/', async (req, res) => {
    const raiz = "src/public/";
    const infoPath = dirTree(raiz,{attributes:["size", "type", "extension","mtime","mode"]});
    //console.log(infoPath);
    let breadcrumb = [{path: "", name:"Inicio"}];
    let files = [];
    
    let re = /\\/gi;
                 //console.log(path.replace(re,"-"));
    if(infoPath.children){

        let arrayChildrens = infoPath.children;
       
        for(let i in arrayChildrens){ 
            //console.log(arrayChildrens[i]);
            
            files.push({
                
                name:arrayChildrens[i].name, 
                path:arrayChildrens[i].path.replace(re,"/").replace(raiz,"/"), 
                type:arrayChildrens[i].type,
                size:arrayChildrens[i].size,
                extension: arrayChildrens[i].type == "directory" ? "" : arrayChildrens[i].extension,
                mtime:arrayChildrens[i].mtime
                
            });
        }


    }

    let parser = new pathToRegex('/:path*');
    console.log(parser.match('user/id'));
    console.log(parser.match('/user/id/ksldjl.xls'));


    console.log(files);
    
    // Encrypt
    //var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

    // Decrypt
    //var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    //var originalText = bytes.toString(CryptoJS.enc.Utf8);

    //console.log(originalText,ciphertext,bytes); // 'my message'
    
    res.render('files',{files,breadcrumb});

});

router.get('/:path_directorio', async (req, res) => {

    
    let raiz = "src/public/";
    const path_directorio = req.params.path_directorio;
    
    console.log(raiz,path_directorio); 
  
    let arrayPath = path_directorio.split("/");
    console.log(arrayPath);
    raiz = raiz+path_directorio+"/";
    console.log(raiz);
    const infoPath = dirTree(raiz,{attributes:["size", "type", "extension","mtime","mode"]});
    
    let breadcrumb = [{path: "", name:"Inicio"}];
    for(i in arrayPath){
        breadcrumb.push({path: "", name:arrayPath[i]});
    }
    
    let re = /\\/gi;
    let files = [];
    if(infoPath.children){

        let arrayChildrens = infoPath.children;
        
        for(let i in arrayChildrens){
            //console.log(arrayChildrens[i]);
            files.push({
                
                name:arrayChildrens[i].name, 
                path:arrayChildrens[i].path.replace(re,"/").replace(raiz,"/"), 
                type:arrayChildrens[i].type,
                size:arrayChildrens[i].size,
                extension: arrayChildrens[i].type == "directory" ? "" : arrayChildrens[i].extension,
                mtime:arrayChildrens[i].mtime
                
            });
        }
        console.log(files);
        res.render('files',{files,breadcrumb});
    }//else{
       // console.log("Descaga archivo");
    //}

    
   
});

*/




module.exports = router;  