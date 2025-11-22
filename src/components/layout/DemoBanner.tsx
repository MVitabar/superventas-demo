import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetMockData } from '@/services/mockDataService';
import { useState } from 'react';

export const DemoBanner = () => {
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = () => {
        setIsResetting(true);
        resetMockData();
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Modo Demo</span>
                    <span className="hidden sm:inline">- Datos de Prueba</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <span>Credenciales:</span>
                        <code className="bg-white/20 px-2 py-1 rounded text-xs">
                            owner@superventas.com / demo123
                        </code>
                    </div>

                    <Button
                        onClick={handleReset}
                        disabled={isResetting}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                        Resetear Datos
                    </Button>
                </div>
            </div>
        </div>
    );
};
