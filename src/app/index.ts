import 'styles/fix.css'
import 'styles/global.sass'
import Promise from 'bluebird'
Promise.config({
  cancellation: true
})
import '../Main'
