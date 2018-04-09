/**
 * Created by shayansiddiqui on 21.03.18.
 */
export as namespace Types;
export type PlotType = 'bar' | 'scatter' | 'scattergl' | 'scatter3d' & 'pie'& 'histogram';
export type ModeType = 'lines' | 'markers' | 'text' | 'lines+markers' | 'text+markers' | 'text+lines' | 'text+lines+markers' | 'none';