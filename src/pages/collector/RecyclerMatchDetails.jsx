import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecyclerMatchDetails() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/collector/requests', { replace: true });
  }, [navigate]);

  return null;
}
