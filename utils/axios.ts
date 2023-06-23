import axios from 'axios'

export module Axios {
  export async function Get (url: any, conf = {}) {
    return await axios.get(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Post (url: any, data = {}, conf = {}) {
    return await axios.post(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Delete (url: any, conf = {}) {
    return await axios.delete(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Head (url: any, conf = {}) {
    return await axios.head(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Options (url: any, conf = {}) {
    return await axios.options(url, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Put (url: any, data = {}, conf = {}) {
    return await axios.put(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }

  export async function Patch (url: any, data = {}, conf = {}) {
    return await axios.patch(url, data, conf)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error))
  }
}
