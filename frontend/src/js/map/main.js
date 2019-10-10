var app = new Vue({
    el: '#app',
    data: {
        json: '',        
        brand: 'Vue Mastery',
        product: 'Socks',
        selectedVariant: 0,
        image: './assets/vmSocks-green.png',
        // inStock: true,
        inventory: 10,
        details: [80% ConstantSourceNode, "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: './assets/vmSocks-green.png',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: './assets/vmSocks-blue.png',
                variantQuantity: 0
            }
        ],
        cart: 0, //inicializa la variable en 0 del contador del carrito
        color: 'black',
        styleObject: { //para el manejo de estilos css
            color: 'green',
            fontSize: '30px'
        },
        activeClass: false,
        errorClass: true,
        isActive: true,
        typeClass: 'active',
        items: [
                    { message: 'Foo' },
                    { message: 'Bar' }
            ]
    }, //DEFINICION DE FUNCIONES
    methods: {
        addToCart: function() {
            this.cart += 1
        },
        UpdateProduct(variantImage) { //obtiene la ruta de la imagen
            console.log(variantImage)
            this.image = variantImage
        },
        UpdateProductIndex(index) { 
            // console.log(index)
            this.selectedVariant = index
        },
        updateJson(){
                this.json = ''
                this.json = JSON.parse(localStorage.jason)
                // alert('MOSTRAR json -> '+JSON.stringify(this.json))
        }            
    },
    computed: {
        title(){
            return this.brand + ' ' + this.product
        },
        imageIndex(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            console.log(this.variants[this.selectedVariant].variantQuantity)
            return this.variants[this.selectedVariant].variantQuantity
        },
        empresas(){
            // this.json = JSON.parse(localStorage.jason)
            // return this.json
        }
    }
})