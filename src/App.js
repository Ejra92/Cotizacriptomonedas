import React, { useState, useEffect } from "react";
import imagen from "./cryptomonedas.png";
import axios from "axios";

const Error = ({ mensaje }) => {
  return <p className="error">{mensaje}</p>;
};

const Cotizacion = ({ resultado }) => {
  if (Object.keys(resultado).length === 0) return null;
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = resultado;
  return (
    <div className="resultado">
      <h2>Resultado</h2>
      <p className="precio">
        El precio es <span>{PRICE}</span>
      </p>
      <p>
        Precio mas alto del dia <span> {HIGHDAY} </span>
      </p>
      <p>
        Precio mas bajo del dia <span> {LOWDAY} </span>
      </p>
      <p>
        Variacion ultimas 24 HRS <span> {CHANGEPCT24HOUR} </span>
      </p>
      <p>
        Ultima actualizacion <span> {LASTUPDATE} </span>
      </p>
    </div>
  );
};

const Criptomoneda = ({ criptomoneda }) => {
  const { FullName, Name } = criptomoneda.CoinInfo;
  return <option value={Name}>{FullName}</option>;
};

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  const [criptomonedas, guardarCriptomonedas] = useState([]);
  const [monedaCotizar, guardarMonedaCotizar] = useState("");
  const [criptoCotizar, guardarCriptoCotizar] = useState("");
  const [error, guardarError] = useState(false);

  //llamando al api desde el useEffect (componentDidMount )
  useEffect(() => {
    const consultarAPI = async () => {
      //guardando url
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
      //haciendo peticion
      const resultado = await axios.get(url);
      //colocando la respuesta en state que pasaremos al select del form
      guardarCriptomonedas(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  const consultarCripto = () => {
    //validar info
    if (monedaCotizar === "" || criptoCotizar === "") {
      guardarError(true);
      return;
    }
    //Enviar Datos al componente principal o padre (APP.js)
    guardarMoneda(monedaCotizar);
    guardarCriptomoneda(criptoCotizar);
    guardarError(false);
  };

  return (
    <form>
      <div className="row">
        {error ? <Error mensaje="Ambos campos son requeridos" /> : null}
        <label htmlFor="">Elige tu Moneda</label>
        <select
          onChange={e => guardarMonedaCotizar(e.target.value)}
          className="u-full-width"
        >
          <option value="">- Moneda a elegir -</option>
          <option value="USD">Dolar Estados Unidos</option>
          <option value="EUR">Euro</option>
          <option value="COP">Peso Colombiano</option>
          <option value="MXN">Peso Mexicano</option>
          <option value="ARS">Peso Argentino</option>
        </select>
      </div>
      <div className="row">
        <label>Elige tu Criptomoneda</label>
        <select
          onChange={e => guardarCriptoCotizar(e.target.value)}
          className="u-full-width"
        >
          <option>- Criptomoneda -</option>
          {criptomonedas.map(criptomoneda => (
            <Criptomoneda
              key={criptomoneda.CoinInfo.Id}
              criptomoneda={criptomoneda}
            />
          ))}
        </select>
      </div>
      <input
        className="button-primary u-full-width"
        onClick={consultarCripto}
        type="button"
        value="Consultar"
      />
    </form>
  );
};

function App() {
  //creando los estados principales
  const [moneda, guardarMoneda] = useState("");
  const [criptomoneda, guardarCriptomoneda] = useState("");
  const [cargando, guardarCargando] = useState(false);
  const [resultado, guardarResultado] = useState({});
  useEffect(() => {
    if (moneda !== "") {
      const cotizarCripto = async () => {
        //guardando direccion de la consulta
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
        //guardando resultado de la consulta
        const resultado = await axios(url);
        //con esto hago que el spinner aparezca
        guardarCargando(true);
        setTimeout(() => {
          guardarCargando(false);
          guardarResultado(resultado.data.DISPLAY[criptomoneda][moneda]);
        }, 4000);
      };
      cotizarCripto();
      //con este temporizador, hago que el spinner desaparezca luego de 4 seg
      //dejando los datos del componente
    }
  }, [moneda]);

  return (
    <div className="container">
      <div className="row">
        <div className="one-half column">
          <img src={imagen} alt="imagen crypto" className="logotipo" />
        </div>
        <div className="one-half column">
          <h1>Cotiza Criptomonedas al Instante</h1>
          <Formulario
            guardarMoneda={guardarMoneda}
            guardarCriptomoneda={guardarCriptomoneda}
          />
          {cargando ? (
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
          ) : (
            <Cotizacion resultado={resultado} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
