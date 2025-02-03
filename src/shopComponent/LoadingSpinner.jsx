import { ClipLoader } from 'react-spinners';
import './LoadingSpinnerCss.css';
const LoadingSpinner = () => {
    return (
        <div className="loading-overlay">
            <ClipLoader size={50} loading={true} />
            <p>Đang tải...</p>
        </div>
    );
};

export default LoadingSpinner;
