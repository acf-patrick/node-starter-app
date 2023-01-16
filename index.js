const fs = require("fs");
const url = require("url");
const http = require("http");

/* Loading templates */

const tCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const tOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");

const replaceTemplate = (template, product) => {
  let ret = template
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%ID%}/g, product.id);
    
  if (!product.organic)
    ret = ret.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return ret;
};

const datas = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const objects = JSON.parse(datas);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case "/overview":
    case '/':
      const cards = objects.map(obj => replaceTemplate(tCard, obj)).join('');
      const overview = tOverview.replace("{%PRODUCT_CARDS%}", cards);

      res.writeHead(200, {
        "Content-type": "text/html"
      }).end(overview);
      break;
  
    case "/product":
      const product = objects[query.id];  
      const response = replaceTemplate(tProduct, product);
      res.writeHead(200, {
        "Content-type": "text/html"
      }).end(response);
      break;

    case "/api":
        res.writeHead(200, {
          "Content-type": "application/json"
        });
        res.end(datas);
      break;

    default:
      res.writeHead(404, {
        "Content-type": "text/html"
      })
      res.end('<h1 style="background: red;">Page not found</h1>');
      break; 
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server running on port 8000");
});
