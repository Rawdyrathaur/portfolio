import { useContext } from 'react';
import { ReadModeContext } from '../context/ReadModeContext';

export function useReadMode() {
  return useContext(ReadModeContext);
}