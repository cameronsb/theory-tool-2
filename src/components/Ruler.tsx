import { useGrid } from '../hooks/useGrid';
import './Ruler.css';

interface RulerProps {
    totalMeasures: number;
}

export function Ruler({ totalMeasures }: RulerProps) {
    const grid = useGrid();

    const measures = Array.from({ length: totalMeasures }, (_, i) => i + 1);

    return (
        <div className="ruler">
            {measures.map(measureNumber => (
                <div
                    key={measureNumber}
                    className="ruler-measure"
                    style={{ width: grid.config.measureWidth }}
                >
                    <div className="measure-number">{measureNumber}</div>
                    <div className="beat-lines">
                        {Array.from({ length: grid.config.beatsPerMeasure }, (_, beatIndex) => (
                            <div
                                key={beatIndex}
                                className="beat-line"
                                style={{ left: beatIndex * grid.config.pixelsPerBeat }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

