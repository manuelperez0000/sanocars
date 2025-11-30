import { useState } from "react"
import request from "../utils/request"

const Test = () => {

    const [message, setMessage] = useState("")

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

        </div>
    )
}

export default Test