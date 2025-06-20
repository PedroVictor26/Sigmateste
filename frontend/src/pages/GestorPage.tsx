import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useAlertas } from '../hooks/useAlertas';
import Header from '../components/Header';
import AlertaMarker from '../components/AlertaMarker';
import Spinner from '../components/common/Spinner';
import '../styles/GestorPage.css';

const GestorPage = ({ onNavigate }) => {
    const { alertas, loading, error } = useAlertas();
    const position = [-23.5505, -46.6333]; // Centro do mapa

    // Transformar alertas para o formato esperado pelo frontend
    const processedAlertas = alertas && alertas.length > 0 ? alertas.map(backendAlert => {
        // Adicionando verificações para garantir que report e prediction existem
        if (!backendAlert.report || !backendAlert.prediction) {
            console.warn('Alerta com estrutura inesperada:', backendAlert);
            return null; // Ou alguma estrutura padrão / log de erro
        }
        return {
            id: backendAlert.id,
            latitude: backendAlert.report.latitude,
            longitude: backendAlert.report.longitude,
            descricao: backendAlert.report.description,
            prioridade: backendAlert.prediction.risk_level,
            tipo: backendAlert.prediction.category,
            equipe_sugerida: backendAlert.prediction.suggested_action,
        };
    }).filter(alerta => alerta !== null) : [];

    return (
        <div className="page-container gestor-page">
            <Header onNavigate={onNavigate} />
            <main className="gestor-content">
                {loading && alertas.length === 0 && <div className="loading-overlay"><Spinner /></div>}
                {error && <div className="error-overlay">{error}</div>}
                <MapContainer center={position} zoom={12} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {processedAlertas.map(alerta => (
                        <AlertaMarker key={alerta.id} alerta={alerta} />
                    ))}
                </MapContainer>
            </main>
        </div>
    );
};

export default GestorPage;