import React from 'react';

interface LoadingProps {
  size?: number; // размер в пикселях
  color?: string; // цвет спиннера
  overlay?: boolean; // затемнение фона
}

const Loading: React.FC<LoadingProps> = ({ size = 64, color = 'blue', overlay = true }) => {
  return (
    <div className={`flex justify-center items-center ${overlay ? 'fixed inset-0 bg-black bg-opacity-30 z-50' : ''}`}>
      <div
        className={`animate-spin rounded-full border-t-4 border-solid`}
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent transparent transparent`,
        }}
      ></div>
    </div>
  );
};

export default Loading;
