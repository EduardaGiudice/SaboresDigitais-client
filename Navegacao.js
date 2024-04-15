import React from 'react'
import { AuthProvider } from './context/authContext'
import Telas from './components/Telas'
import { PostProvider } from './context/postContext'

const Navegacao = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <Telas />
      </PostProvider>
    </AuthProvider>
  );
}

export default Navegacao;