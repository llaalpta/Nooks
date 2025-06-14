import TreasureFormScreen from './treasure-form';

export default function TreasureDetailsScreen() {
  // Esta pantalla simplemente renderiza el treasure-form que automáticamente
  // detectará si está en modo edición basado en el parámetro id de la URL
  return <TreasureFormScreen />;
}
