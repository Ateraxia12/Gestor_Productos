import React, { useState } from 'react';
import '../style/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData); // Mostrar datos del formulario en la consola

   
    const serviceID = 'YOUR_SERVICE_ID'; // Reemplaza con tu Service ID de EmailJS
    const templateID = 'YOUR_TEMPLATE_ID'; // Reemplaza con tu Template ID de EmailJS
    const publicKey = 'YOUR_PUBLIC_KEY'; // Reemplaza con tu Public Key de EmailJS

   
    emailjs.send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log('Correo enviado exitosamente:', response); // Confirmación de éxito
        setAlert({
          type: 'success',
          message: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setAlert(null), 3000);
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error); // Detalles del error
        setAlert({
          type: 'success',
          message: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!',
        });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  return (
    <div className="contact-container">
      <h2>Contacto</h2>
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
      <div className="contact-content">
        <div className="contact-form">
          <h3>Envíanos un mensaje</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Asunto del mensaje"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit">Enviar Mensaje</button>
          </form>
        </div>
        <div className="contact-info">
          <h3>Información de Contacto</h3>
          <p><strong>Correo:</strong> soporte@micfor.com</p>
          <p><strong>Teléfono:</strong> +57 3104710120</p>
          <p><strong>Dirección:</strong> Av. Principal 123, Ciudad Calarca, País Colombia</p>
          <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;