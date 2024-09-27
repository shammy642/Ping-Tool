export const getDeviceList = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          return data
        })
        .catch((error) => {
            return error
        })
};


export const shouldPing = async (shouldPing: boolean) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/shouldPing`, {
    method: "PUT",
    body: JSON.stringify({ "shouldPing": shouldPing })
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
        return error
    })
}

