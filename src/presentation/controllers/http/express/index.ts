import { HOST_PORT } from "../../../../env-variables"
import app from "./app"

app.listen(HOST_PORT, () =>
    console.log(`Server is running on port ${HOST_PORT}`)
)
