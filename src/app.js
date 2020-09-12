import inquirir from "inquirer";
import { exec } from "promisify-child-process";
const data_babel_rc = `{
    "presets": [
        "@babel/preset-env"
    ]
}`;
const data_git_ignore = `.env
.git
node_modules
`;
// const carpeta_src=`
//     mkdir src && cd src &&
//     touch index.js && echo 'require("@babel/polyfill");
//     require("@babel/register")({
//         /*extends:"./.babelrc",*/
//         extensions: [".es6", ".es", ".jsx", ".js", ".mjs"],
//         ignore:[/node_modules/]
//     });

//     require("./handler/"+this.process.handler);' > index.js &&
//     mkdir datalayer functions handler
// `
const package_json = (parameter) => `
{
    "name": "${parameter.package_name}",
    "version": "${parameter.version}",
    "description": "${"version" in parameter ? parameter.description : ""}",
    "main": "src/index.js",
    "scripts": {
      "test": "echo testing && exit 1",
      "dev": "cross-env NODE_ENV=development nodemon src/index",
      "build": "babel src -d dist",
      "start": "cross-env NODE_ENV=production node dist/index"
    },
    "keywords": [],
    ${
      parameter.git_repository != ""
        ? `
        "repository": {
            "type": "git",
            "url": "${
              "git_repository" in parameter ? parameter.git_repository : "\t"
            }"
          },     
        `
        : ""
    }
   
    
      "author": "${parameter.author}",
    "license": "${parameter.license}",
    "dependencies": {
      "@babel/cli": "^7.10.1",
      "@babel/core": "^7.10.2",
      "@babel/polyfill": "^7.10.1",
      "@babel/preset-env": "^7.10.2",
      "@babel/register": "^7.10.1",
      "cross-env": "^7.0.2"
    },
    "devDependencies": {
      "dotenv": "^8.2.0",
      "nodemon": "^2.0.4"
    }
  }
  `;
console.log(`

  ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗      ███████╗███████╗ ██████╗       ███╗   ██╗ ██████╗ ██████╗ ███████╗
  ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝      ██╔════╝██╔════╝██╔════╝       ████╗  ██║██╔═══██╗██╔══██╗██╔════╝
     ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  █████╗█████╗  ███████╗███████╗ █████╗██╔██╗ ██║██║   ██║██║  ██║█████╗  
     ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════╝██╔══╝  ╚════██║██╔═══██╗╚════╝██║╚██╗██║██║   ██║██║  ██║██╔══╝  
     ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗      ███████╗███████║╚██████╔╝      ██║ ╚████║╚██████╔╝██████╔╝███████╗
     ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝      ╚══════╝╚══════╝ ╚═════╝       ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝
                                                                                                                                                                                                                                                                                                                                     
  `);
console.log(`
┌┐ ┬ ┬  ┌─┐┬ ┬┌─┐┌─┐ ┬ ┬┌─┐┌─┐┌─┐┬ ┬┬─┐┬ ┬┌─┐
├┴┐└┬┘  │  ├─┤│ ││─┼┐│ │├┤ └─┐├─┤│ │├┬┘│ │└─┐
└─┘ ┴   └─┘┴ ┴└─┘└─┘└└─┘└─┘└─┘┴ ┴└─┘┴└─└─┘└─┘
  `);
console.log("**********************");
//let nom_carpeta=""
inquirir
  .prompt([
    {
      type: "input",
      name: "working_dir",
      message: "¿Nombre de la carpeta a crear (Working directory)?: ",
      default:
        "Carpeta_" + new Date().toLocaleString().replace(/[\s:\/]/g, "-"),
      // default:"Carpeta_"+new Date().toLocaleString().replace(/\//g,"-")
    },

    {
      type: "input",
      name: "package_name",
      message: "Configurando package.json :\npackage name :",
      default: "default(working_dir)",
      //when:(entrada) => {nom_carpeta=entrada.working_dir; return true}
    },
    {
      type: "input",
      name: "version",
      message: "version : ",
      default: "v1.0.0",
      //when:(entrada) => entrada.npm_init == 'Manual'?true:false
    },
    {
      type: "input",
      name: "description",
      message: "description : ",
      default: "",
      //when:(entrada) => entrada.npm_init == 'Manual'?true:false
    },
    {
      type: "input",
      name: "git_repository",
      message: "git repository : ",
      default: "",
      //when:(entrada) => entrada.npm_init == 'Manual'?true:false
    },
    {
      type: "input",
      name: "author",
      message: "author : ",
      default: "",
      //when:(entrada) => entrada.npm_init == 'Manual'?true:false
    },
    {
      type: "input",
      name: "license",
      message: "Licencia : ",
      default: "MIT",
      //when:(entrada) => entrada.npm_init == 'Manual'?true:false
    },
    {
      type: "checkbox",
      name: "archivos_primarios",
      message: "Marca que deseas generar automaticamente : ",
      choices: [
        ".babelrc",
        ".env",
        "Dockerfile",
        ".gitignore",
        "Docker-compose.yml",
        //"eslint",
        "readme.md",
      ],
    },
    {
      type: "list",
      name: "npm_install",
      message:
        "¿Deseas que se instale automaticamente las dependencias requeridas?",
      choices: ["Si", "No"],
    },
    {
      type: "list",
      name: "open_proyect",
      message:
        "Cual es el comando para importar tu proyecto en tu editor de codigo : ?",
      choices: ["code", "mate", "subl", "atom", "Ninguna de las anteriores"],
    },
  ])
  .then(async (data) => {
    const {
      package_name: proccess_package_name,
      author,
      license,
      git_repository,
      version,
      description,
    } = data;
    const package_name =
      proccess_package_name == "default(working_dir)"
        ? data.working_dir
        : proccess_package_name;
    const { stdout } = await exec(`mkdir ${data.working_dir}`);
    //data["npm_init"] == 'Automatico'?
    await exec(`git init`, { cwd: data.working_dir });
    await exec(
      `touch package.json && echo '${package_json({
        package_name,
        author,
        license,
        git_repository,
        author,
        version,
        description,
      })}'>package.json`,
      { cwd: data.working_dir }
    );
    //:await exec(`touch package.json && echo '${package_json(destructuring_data)}'`,{cwd:data.working_dir})
    for (let item of data.archivos_primarios) {
      if (item == ".babelrc") {
        await exec(`touch ${item} && echo '${data_babel_rc}'> ${item}`, {
          cwd: data.working_dir,
        });
      }
      if (item == ".gitignore") {
        await exec(`touch ${item} && echo '${data_git_ignore}'> ${item}`, {
          cwd: data.working_dir,
        });
      }
      if (item == ".env") {
        await exec(`touch ${item} && echo 'handler=express'>${item}`, {
          cwd: data.working_dir,
        });
      }
      await exec(`touch ${item}`, { cwd: data.working_dir });
    }
    await exec("git clone https://github.com/WasauskyOK/src.git", {
      cwd: data.working_dir,
    });
    if (data.npm_install == "Si") {
      console.log("Instalando dependencias necesarias ...");
      await exec("npm install", { cwd: data.working_dir });
      console.log("Dependencias instaladas ... \n");
    }
    console.log(
      "Ejecutando en desarrollo (npm run dev) en una nueva terminal :D"
    );
    await exec(
      `gnome-terminal -- bash -c 'npm run dev; exec zsh || exec bash'`,
      { cwd: data.working_dir }
    );
    data.open_proyect == "Ninguna de las anteriores"
      ? console.log("Abre con tu editor favorito :D")
      : await exec(`${data.open_proyect} .`, { cwd: data.working_dir });
    console.log("Adios :D");
  })
  .catch((error) => console.log(error));
