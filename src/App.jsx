import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './styles.css';

const productosDisponibles = [
  { value: 'pancito_jamon', label: 'Pancito de Jamón' },
  { value: 'pancito_queso', label: 'Pancito de Queso' },
  { value: 'pancito_chocolate', label: 'Pancito de Chocolate' },
  { value: 'pancito_integral', label: 'Pancito Integral' }
];

const App = () => {
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    nombre: 'Fernanda',
    apellido: 'Quezada',
    cantidad: '12',
    producto: '',
    telefono: '9613357013'
  });

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:4000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Conexión WebSocket establecida correctamente');
    };

    newSocket.onmessage = handleWebSocketMessage;

    window.addEventListener('beforeunload', handleCloseWebSocket);

    return () => {
      handleCloseWebSocket();
      window.removeEventListener('beforeunload', handleCloseWebSocket);
    };
  }, []);

  const handleInputChange = (selectedOption) => {
    setFormData({
      ...formData,
      producto: selectedOption
    });
  };

  const handleEnviarPagos = async () => {
    try {
      const response = await axios.post('http://localhost:3001/pagos', formData);
      console.log('Compra realizada correctapente:', response.data);
      setNotification({
        message: `Holi ${formData.nombre}, tu pago por el panecillo ${formData.producto.label} esta hecho, gracias por su compra , regrese pronto `
      });
      setTimeout(() => {
        setNotification(null);
      }, 10000);
    } catch (error) {
      console.error('Error al enviar el pago:', error);
    }
  };

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data);

    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleCloseWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className="app-container"> 
      <h1>Bienvenido a PanaderiaUP</h1>
      <h4>Realiza la compra de tu panecillo favorito</h4>
      {notification && (
        <div className="notification">
          {notification.message}
        </div>
      )}
      <div className="pagos-form" >
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
        <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={(e) => setFormData({...formData, cantidad: e.target.value})} />
        <Select
          name="producto"
          placeholder="Seleccione un producto"
          value={formData.producto}
          onChange={handleInputChange}
          options={productosDisponibles}
        />
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
        <button onClick={handleEnviarPagos} className='botoncito'>Enviar</button>
      </div>
    </div>
  );
};

export default App;


