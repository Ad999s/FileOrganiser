// commands possible :
// tree "dirpath"->>> displays in tree format
// organise "dirpath"->organises given directory
// help ->list commands 
let fs = require("fs");
const fse = require('fs-extra');
const { dirname } = require("path");
let path = require("path");
let u = require("./utility.js");
let inputArr = process.argv.slice(2);
// now inputarr[0] contains command and 1 contains dirpath
switch (inputArr[0]) {
    case "help":
        help();
        break;
    case "tree":
        tree(inputArr[1]);
        break;
    case "organise":
        organise(inputArr[1]);
        break;
    default:
        console.log("please enter right command for more info type help.");
        break;
}
//creating and defining each function
function help() {
    console.log("commands available:\ntree dirpath\norganise dirpath\n");
}

function organise(dirpath) {
    // first thing is checking input before organising
    let exists = fs.existsSync(dirpath);
    if (exists == true) {
        // that means path exists
        // now checking if path given is file or directory
        let pathDetails = fs.lstatSync(dirpath);
        let isfile = pathDetails.isFile();
        if (!isfile) {
            // now our main work starts
            organiseHelper(dirpath);
        } else {
            console.log("please enter directory path not file!!");
            return;
        }
    } else {
        console.log("Please enter valid path");
        return;
    }

}

function organiseHelper(dirpath) {
    // dirpath defines directory to be organised
    let dir = "Organised";
    let destPath = path.join(dirpath, dir);
    // edge case that checks that organised folder is already organised or not
    if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath);
    }
    // lets create subfolders in destpath
    createSubf(destPath);
    // now we need to loop in source directory for files and start copying in destpath
    let contents = fs.readdirSync(dirpath);
    if (contents.length == 0) {
        return;
    }
    let filescopied = 0;
    for (let i = 0; i < contents.length; i++) {
        // need to get extension for content
        console.log(++filescopied, "out of", contents.length)
        if (contents[i] != dir) {

            let content = path.join(dirpath, contents[i]);
            let pathDetails = fs.lstatSync(content);
            let isfile = pathDetails.isFile();
            let ext = path.extname(contents[i]);
            // if ()
            let copyTo;
            if (isfile) {
                for (let folder in u) {
                    for (let j = 0; j < u[folder].length; j++) {
                        if (ext == "." + u[folder][j]) {
                            // copy that file to destination folder
                            let filepath = path.join(dirpath, contents[i]);
                            let copyTo = path.join(destPath, folder);
                            fs.copyFileSync(filepath, copyTo + "\/" + contents[i], (err) => {
                                if (err)
                                    throw err;
                                fs.unlinkSync(filepath);
                            });

                        }
                    }
                }
            } else {
                let source = path.join(dirpath, contents[i]);
                let destination = path.join(destPath, "Folders", contents[i]);
                console.log("Copying Subfolder ", contents[i]);
                copyfolder(source, destination, contents[i], 1);
                console.log("Done copying ", contents[i]);
                console.log("\n");

            }

        }
    }

}

function createSubf(destPath) {
    for (let subF in u) {
        let temp = path.join(destPath, subF);
        if (fs.existsSync(temp) == false)
            fs.mkdirSync(temp);
    }
    let temp = path.join(destPath, "Folders");
    if (fs.existsSync(temp) == false)
        fs.mkdirSync(temp);
}


function copyfolder(src, dest, dirName, k) {
    // creating folder named dirname in destination folder
    // console.log(1);
    if (fs.existsSync(dest) == true) {
        return;
    }
    fs.mkdirSync(dest);
    // loop through src folder
    let contents = fs.readdirSync(src);
    //base case
    if (contents.length == 0) {
        return;
    }
    // getting contents in particular directory given
    for (let i = 0; i < contents.length; i++) {
        let subf = path.join(src, contents[i]);
        let pathDetails = fs.lstatSync(subf);
        let isfile = pathDetails.isFile();
        if (!isfile) {
            // create a folder called contents[i] in destination folder
            let fol = path.join(dest, contents[i]);
            // copy recursively but now destination changes
            copyfolder(subf, fol, contents[i], ++k);


        } else {
            let filepath = path.join(src, contents[i]);
            fs.copyFileSync(filepath, dest + "\/" + contents[i], (err) => {
                if (err)
                    throw err;
            });
        }
    }
}
