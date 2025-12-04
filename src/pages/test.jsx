import { useState } from "react"
import request from "../utils/request"

const Test = () => {

    const [message, setMessage] = useState("")
    const [value, setValue] = useState('')

    const handleChange = e => {
    const num = e.target.value.replace(/\D/g, ""); // solo dígitos
    setValue(num ? parseInt(num, 10).toLocaleString("es-VE") : "");
  };

  const numericValue = parseInt(value.replace(/\./g, ""), 10) || 0;

    const test = async (url) => {
        try {
            const urls = ["http://localhost:3000", "https://app.sanocars.com"]
            const response = await request.get(urls[url])
            console.log(response.data)

            if (!url) {
                setMessage("Local: " + response.data.message)
            } else {
                setMessage("Server: " + response.data.message)
            }

        } catch (error) {

            setMessage(`Error fetching ${url ? " Server" : " Local"}`)
            console.log(error)
        }
    }

    return (
        <div className="">
            <button onClick={() => test(0)}> get local </button>
            <button onClick={() => test(1)}> get hosting </button>

            <div>
                {message || "Not fetched message"}
            </div>

            <div className="p-3">
                <div className="mb-3 ">{numericValue}</div>
                <input type="text" value={value} onChange={handleChange} />
            </div>

        </div>
    )
}

export default Test