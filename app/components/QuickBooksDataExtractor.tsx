import React, { useState, useCallback } from 'react';
import { Download, RefreshCw, Calendar, Database, TrendingUp, AlertCircle, CheckCircle, Clock, Settings } from 'lucide-react';
import { getQuickBooksService } from '../lib/quickbooksService';

const qbService = getQuickBooksService();

// ... existing code ... 