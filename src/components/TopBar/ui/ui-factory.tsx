import React from 'react';
import { useMirror } from '../store';
import GuestTopBar from './GuestTopBar';
import LoggedInTopBar from './LoggedInTopBar';

export default function UiFactory() {
    const type = useMirror("type");

    if (type === "auth") {
      return <LoggedInTopBar />;
    }
  
    return <GuestTopBar />;
  }
