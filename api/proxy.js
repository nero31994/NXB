import axios from "axios";

export default async function handler(req, res) {
  const path = req.query.path;
  if (!path) {
    return res.status(400).send("Missing path");
  }

  const originBase = "http://143.44.136.110:6910/";
  const targetUrl = originBase + path;

  try {
    const response = await axios.get(targetUrl, { responseType: "arraybuffer" });

    res.setHeader("Access-Control-Allow-Origin", "*");

    if (path.endsWith(".mpd")) {
      let mpdXml = response.data.toString();

      const originalBase = "http://143.44.136.110:6910/";
      const proxyBase = `${req.headers["x-forwarded-proto"]}://${req.headers.host}/api/proxy?path=`;

      mpdXml = mpdXml.replace(new RegExp(originalBase, "g"), proxyBase);

      res.setHeader("Content-Type", "application/dash+xml");
      return res.send(mpdXml);
    }

    res.setHeader("Content-Type", response.headers["content-type"]);
    return res.send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Proxy error");
  }
} 
