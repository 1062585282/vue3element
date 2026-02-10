// 登录状态管理
import { ref } from 'vue'

// 登录状态
const isLoggedIn = ref(false)
const userInfo = ref(null)
const token = ref(null)

// 登录
const login = (userData, authToken) => {
  isLoggedIn.value = true
  userInfo.value = userData
  token.value = authToken
  
  // 存储到localStorage
  localStorage.setItem('isLoggedIn', 'true')
  if (userData) {
    localStorage.setItem('userInfo', JSON.stringify(userData))
  }
  if (authToken) {
    localStorage.setItem('token', authToken.token)
  }
}

// 登出
const logout = () => {
  isLoggedIn.value = false
  userInfo.value = null
  token.value = null
  
  // 清除localStorage
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
}

// 初始化登录状态
const initAuth = () => {
  const savedLoggedIn = localStorage.getItem('isLoggedIn')
  if (savedLoggedIn === 'true') {
    const savedUserInfo = localStorage.getItem('userInfo')
    const savedToken = localStorage.getItem('token')
    
    if (savedUserInfo) {
      userInfo.value = JSON.parse(savedUserInfo)
    }
    if (savedToken) {
      token.value = savedToken
    }
    isLoggedIn.value = true
  }
}

export {
  isLoggedIn,
  userInfo,
  token,
  login,
  logout,
  initAuth
}