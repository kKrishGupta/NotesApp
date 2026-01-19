const express = require('express');
const app = express();
const path = require('path');
const rootDir = require('./utils/pathUtils');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  fs.readdir(`./files`,function(err, files){
    // console.log(files);
    res.render('index', { files: files });
  });
});

app.get('/files/:filename', (req, res) => {
 fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
  //  console.log(data);
  if (err) {
     console.error('Error reading file:', err);
     return res.status(500).send('Internal Server Error');
   }
   res.render('file', {filename: req.params.filename,  data: data });
 });
 });

app.get('/edit/:filename', (req, res) => {
 res.render('edit',{filename:req.params.filename});
 });

 app.post('/edit/', (req, res) => {
//  res.render('edit',{filename:req.params.filename});
// console.log(req.body);
fs.rename(`./files/${req.body.prevTitle}`, `./files/${req.body.newTitle}`, (err) => {
  if (err) {
    console.error('Error renaming file:', err);
    return res.status(500).send('Internal Server Error');
  }res.redirect('/');
});
 });

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Internal Server Error');
    }res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});