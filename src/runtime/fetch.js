const baseUrl = 'http://localhost:4000/';

class Fetch {
  static async request(mod, body, options={}) {
    options = Object.assign({
      method: 'POST',
      body
    }, options);
    let res = await fetch(`${baseUrl}${mod}`, options);
    return await res.json();
  }

  static async invoke(mod, body) {
    return await Fetch.request(mod, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  static async upload(body) {
    return await Fetch.request('upload', body);
  }
}

export default Fetch;
