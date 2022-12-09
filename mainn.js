// commands possible :
// tree "dirpath"->>> displays in tree format
// organise "dirpath"->organises given directory
// help ->list commands 
let fs = require("fs");
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
    let dir = "Organised";
    let destPath = path.join(dirpath, dir);

    if (fs.existsSync(destPath) == false) {

        fs.mkdirSync(destPath);

    }
    // lets create subfolder in destpath
    for (let key in u) {
        let temp = path.join(destPath, key);
        if (fs.existsSync(temp) == false)
            fs.mkdirSync(temp);
    }
    // now we need to loop in source directory for files and start copying in destpath
    let contents = fs.readdirSync(dirpath);
    if (contents.length == 0) {
        return;
    }
    let filescopied = 0;
    for (let i = 0; i < contents.length; i++) {
        // need to get extension for content
        let pathDetails = fs.lstatSync(dirpath + "\/" + contents[i]);
        let isfile = pathDetails.isFile();
        let ext = path.extname(contents[i]);
        let copyTo;
        if (isfile)
            for (let folder in u) {
                // console.log(folder + "\n");
                for (let j = 0; j < u[folder].length; j++) {
                    if (ext == "." + u[folder][j]) {
                        // copy that file to destination folder
                        let filepath = path.join(dirpath, contents[i]);
                        let copyTo = path.join(destPath, folder);
                        fs.copyFile(filepath, copyTo + "\/" + contents[i], (err) => {
                            if (err)
                                throw err;
                            filescopied++;
                            console.log(filescopied, "out of", contents.length - 1);
                            fs.unlinkSync(filepath);
                        });

                    }
                }
            }
    }
}