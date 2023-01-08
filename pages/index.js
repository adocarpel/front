import { useEffect, useState } from "react"
const initialProductState = { name: "", price: 0 }
const initialMovementState = { type: "Compra", quantity: 0 }

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState()
  const [product, setProduct] = useState(initialProductState)
  const [movement, setMovement] = useState(initialMovementState)
  const [products, setProducts] = useState([])

  const handleChange = (e) => {
    const inputValue = e.target.value
    const inputName = e.target.name
    setProduct({
      ...product,
      [inputName]: inputValue,
    })
  }
  const handleMovementChange = (e) => {
    const inputValue = e.target.value
    setMovement({
      ...movement,
      quantity: +inputValue,
    })
  }

  const handleSelectType = (type) => {
    console.log({ type })
    setMovement({ ...movement, type })
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
      const data = await res.json()
      setProduct(initialProductState)
      console.log({ data })
      const newProducts = [data.product, ...products]
      setProducts(newProducts)
      // fetchProducts()
    } catch (error) {
      console.log({ error })
    }
  }

  const handleCreateMovement = async (e) => {
    try {
      const res = await fetch(
        `${baseUrl}/products/movement/${selectedProductId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movement),
        }
      )
      const data = await res.json()
      console.log({ data })
      setProduct(initialMovementState)
      setSelectedProductId(null)
      fetchProducts()
    } catch (error) {
      console.log({ error })
    }
  }

  const fetchProducts = () => {
    fetch(`${baseUrl}/products`)
      .then((res) => res.json())
      .then(({ products }) => {
        setProducts(products)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  console.log({ products })

  return (
    <>
      <div className="container df jcsb">
        <div className="df fdc">
          <h2 style={{ margin: "0.3rem" }}>
            <u>Crear nuevo producto</u>
          </h2>
          <form>
            <input
              type="text"
              name="name"
              className="onone"
              value={product.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              className="onone"
              value={product.price}
              onChange={handleChange}
            />
            <button onClick={handleCreateProduct} className="cursorp">
              Crear producto
            </button>
          </form>
          <h2 style={{ margin: "0.3rem" }}>
            <u>Crear movimiento stock</u>
          </h2>
          <div className="df aic mb5">
            {["Compra", "Venta"].map((type) => (
              <div
                onClick={() => handleSelectType(type)}
                className="shadow mr5 p5 br5 cursorp"
                key={type}
                style={{
                  backgroundColor:
                    type === movement.type ? "lightblue" : "white",
                }}
              >
                <span>{type}</span>
              </div>
            ))}
          </div>
          <input
            type="number"
            name="quantity"
            className="onone"
            value={movement.quantity}
            defaultValue={movement.quantity}
            onChange={handleMovementChange}
          />
          <button onClick={handleCreateMovement} className="cursorp">
            Crear movimiento de stock
          </button>
        </div>
        <div className="products-container">
          {products.map(({ _id, name, price, stock }) => (
            <div
              onClick={() => setSelectedProductId(_id)}
              className="shadow df aic jcsb p5 mb5 br5"
              style={{
                backgroundColor:
                  selectedProductId === _id ? "lightblue" : "white",
                width: "100%",
              }}
              key={_id}
            >
              <span>{name}</span>
              <div className="df aic">
                <div className="df fdc mr5">
                  <span>${price}</span>
                  <span>Stock: {stock}</span>
                </div>
                <i
                  className="fas fa-trash cursorp cred"
                  onClick={() => {
                    fetch(`${baseUrl}/products/${_id}`, { method: "DELETE" })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log({ data })
                      })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          form {
            display: flex;
            flex-direction: column;
            width: 20rem;
            margin: 0 auto;
          }

          .shadow {
            box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          }

          h1 {
            text-align: center;
          }

          .products-container {
            overflow: hidden;
            overflow-y: auto;
            max-height: 20rem;
            padding: 0.5rem;
            width: 100%;
          }

          .container {
            background-color: white;
            width: 50rem;
            margin: 0 auto;
            margin-top: 5rem;
            border-radius: 0.5rem;
            padding: 1rem;
          }
        `}
      </style>
    </>
  )
}
