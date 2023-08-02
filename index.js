import {promises as fs} from 'fs';

class ProductManager{
    constructor(){
        this.path = './products.txt';
    }

    //Método para agregar los productos al carrito
    addProduct = async (product) => {
      const products = JSON.parse (await fs.readFile(this.path,'utf-8'));
 
        //Código para verificar que no se repita el mismo código de producto
      if (products.some(prod => prod.code === product.code)) {
        console.log(`ERROR: Ya existe un producto con el código:${product.code}`)
        return
        }

      if( !product.title || !product.description || !product.price || !product.thumbnail ||! product.code || product.stock < 0){
          console.log("Todos los campos son obligatorios")
          return
        }else{
          products.push(product) //Se utiliza push para pasar los datos que se encuentran al array vacio en el archivo .txt
        }

      await fs.writeFile(this.path,JSON.stringify(products));
       
      console.log ("Producto agregado correctamente");
    }

    //Método para traer los productos
    getProducts = async() => {
        const products = JSON.parse(await fs.readFile(this.path,'utf-8'))
        console.log(`Hola, los productos en tu carrito son:`, JSON.stringify(products));
    }
    //Método para traer el producto que coincida con el número ingresado
    getProductByID = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const getID = products.find(prod => prod.id === id)
        if (getID){
            console.log (`Se encontró el ID-N° ${id} y su producto es:`, JSON.stringify(getID))
          } else { 
            console.log(`El ID: ${id} no existe!`)
          }
    }
    //Método para actualizar los productos en el archivo .txt
    updateProducts = async(id, {title, description, price, thumbnail, code, stock })=>{
        const products = JSON.parse (await fs.readFile(this.path, 'utf-8'))
        const index = products.findIndex (prod => prod.id === id)

        if (index !== -1){ 
            const product = products[index]
            product.title = title ?? product.title;
            product.description = description ?? product.description;
            product.price = price ?? product.price;
            product.thumbnail = thumbnail ?? product.thumbnail;
            product.code = code ?? product.code;
            product.stock = stock ?? product.stock;
        
            await fs.writeFile(this.path, JSON.stringify(products));
            console.log(`Tu producto se actualizó correctamente!`, JSON.stringify(products[index]))
        }else{
            console.log (`El producto con el ID: ${id} no existe!`)
        }
    }
    //Método para borrar los productos según el ID ingresado
    deleteProducts = async (id) => {
        const products = JSON.parse (await fs.readFile(this.path,'utf-8'))
        const deleteID = products.filter(prod => prod.id != id)

        await fs.writeFile(this.path, JSON.stringify(deleteID));
         
        console.log ("Producto borrado correctamente");    
      }
}
  //CLASE PRODUCTO
class Product {

    constructor(title,description, price,thumbnail,code,stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.incrementID() 
    }
  //MÉTODO PARA INCREMENTAR EL ID DE LOS PRODUCTOS QUE SE VAN GENERANDO  
    static incrementID (){
        this.idIncrement = this.idIncrement ? this.idIncrement + 1:1
        return this.idIncrement;
    } 
}

const product1 = new Product ("Remera", "Algodón", 7000, "Imagen 01", "A01", 20);
const product2 = new Product ("Pantalón","Camuflado", 12000, "Imagen 02", "A02", 25);
const product3 = new Product ("Buzo", "Canguro", 7000, "Imagen 03"); //Error: Falta completar campos
const product4 = new Product ("Gorro", "Lana",5000,"Imagen04", "A01",10 ); //Error: Código repetido

const productManager = new ProductManager()

const callBacks = async ()=> {
await productManager.addProduct(product1);
await productManager.addProduct(product2);
await productManager.addProduct(product3);
await productManager.addProduct(product4);

await productManager.getProductByID(1);
await productManager.getProductByID(10);

await productManager.getProducts();

await productManager.updateProducts(1, { title: "Alpargatas", description: "Havaianas", price: 1000, thumbnail:"404 Not found"})
await productManager.updateProducts(5, { title: "Remerón", description: "Blanco liso"})

await productManager.deleteProducts(1);

}
callBacks();
