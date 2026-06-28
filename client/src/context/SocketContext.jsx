import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext();

const SOCKET_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5050'
  : window.location.origin;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Socket listeners
    newSocket.on('connect', () => {
      console.log('Socket client connected:', newSocket.id);
    });

    newSocket.on('newReportAlert', (report) => {
      // Don't show toast to the user who created the report, but still put it in the alert log
      const isCreator = report.userId && report.userId._id === user.id;
      
      const alertMsg = `New ${report.severity} severity incident reported: "${report.title}" at ${report.location.name}`;
      
      if (!isCreator) {
        showToast(
          alertMsg,
          report.severity === 'High' ? 'warning' : 'info'
        );
      }

      setAlerts((prev) => [
        {
          id: report._id,
          title: report.title,
          severity: report.severity,
          locationName: report.location.name,
          timestamp: new Date(),
          type: 'new',
          description: report.description,
          reporter: report.userId ? report.userId.name : 'Anonymous',
        },
        ...prev,
      ]);
    });

    newSocket.on('reportUpdated', (report) => {
      const isCreator = report.userId && report.userId._id === user.id;
      const alertMsg = `Incident status updated: "${report.title}" is now ${report.status}`;

      showToast(alertMsg, report.status === 'Resolved' ? 'success' : 'info');

      setAlerts((prev) => [
        {
          id: report._id,
          title: report.title,
          severity: report.severity,
          locationName: report.location.name,
          timestamp: new Date(),
          type: 'update',
          status: report.status,
          description: `Status changed to: ${report.status}`,
          reporter: report.userId ? report.userId.name : 'Anonymous',
        },
        ...prev,
      ]);
    });

    newSocket.on('reportDeleted', (reportId) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== reportId));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <SocketContext.Provider value={{ socket, alerts, clearAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
