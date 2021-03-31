module.exports = class TestController {

  get = async(req, res) => {
    console.log(req)
  }
  other = async(req, res) => {
    console.log(req)
    return res.status(200).json({
      message: 'OK'
    })
  }
}
