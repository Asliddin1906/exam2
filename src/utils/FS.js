import fs from 'fs'
import path from 'path'


// export const read = dir => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'database', dir + ".json")))
export const read = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), "src", "database", dir + ".json"), 
    (err, data) => {
      if (!fs.existsSync(path.join(process.cwd(), "src", "database", dir + ".json"))) {
        return reject("not found" + dir);
      }

      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

export const write  = (dir , data ) => {
  return new Promise((resolve , reject) =>{
    fs.writeFile(path.join(process.cwd() , 'src' , 'database' , dir + ".json") , JSON.stringify(data , null , 4) , 
    err=> {
      if(err) reject(err)

      resolve(data)
    })
  })
}