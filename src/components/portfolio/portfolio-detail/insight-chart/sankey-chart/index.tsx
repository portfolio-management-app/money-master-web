import React, { useEffect, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';

import { SankeyRects } from './sankey-rect';
import { SankeyLinks } from './sankey-link';
import { SankeyLabels } from './sankey-label';

import { observer } from 'mobx-react-lite';
import { portfolioDetailStore } from 'shared/store';

export interface SankeyDataLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyDataNode {
  name: string;
  category: string;
}

export interface SankeyData {
  nodes: SankeyDataNode[];
  links: SankeyDataLink[];
}

interface SankeyChartProps {
  width: number;
  height: number;
}

import { sankey, SankeyLayout } from 'd3-sankey';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { schemeCategory10, interpolatePiYG } from 'd3-scale-chromatic';
import { format } from 'd3-format';

import { RectNode } from './sankey-rect';
import { PathLink } from './sankey-link';
import { instanceOf } from 'prop-types';

const d3Color = scaleOrdinal(schemeCategory10);

export const colorRectFunc = (dataPoint: RectNode) =>
  d3Color(dataPoint.category || dataPoint.name);

export const colorLinkFunc = (dataPoint: PathLink) => {
  const name =
    typeof dataPoint.target === 'object' &&
    dataPoint.target['name'] !== undefined
      ? dataPoint.target['name']
      : dataPoint.target;

  return d3Color(name);
};

const d3format = format(',.0f');

export const formatRectTitleFunc = (dataPoint: RectNode) => {
  if (!dataPoint.value) return dataPoint.name;

  return `${dataPoint.name}\n${d3format(dataPoint.value)} TWh`;
};

export const formatLinkTitleFunc = ({
  source,
  target,
  value,
}: PathLink): any => {
  const sourceName =
    typeof source === 'object' && source['name'] !== undefined
      ? source['name']
      : source;
  const targetName =
    typeof target === 'object' && target['name'] !== undefined
      ? target['name']
      : target;

  return `${sourceName.split('@@')[1]} → ${
    targetName.split('@@')[1]
  }\n${d3format(value)}`;
};

interface MakeSankeyInput {
  width: number;
  height: number;
}

export const makeSankeyFunc = ({
  width,
  height,
}: MakeSankeyInput): SankeyLayout<
  SankeyData,
  SankeyDataNode,
  SankeyDataLink
> => {
  const sankeyGen = sankey<SankeyDataNode, SankeyDataLink>()
    .nodeId((d) => d.name)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  return sankeyGen;
};

const isFullLink = (
  SankeyDataLink: SankeyDataLink,
): SankeyDataLink is Required<SankeyDataLink> => {
  return !!(
    SankeyDataLink.source &&
    SankeyDataLink.target &&
    SankeyDataLink.value
  );
};

const formatData = async (
  SankeyDataLinks: SankeyDataLink[],
): Promise<SankeyData> => {
  //format of input:
  // {
  //   source: <category>@@<name>
  //   target: <category>@@<name>
  //   value: number
  // }

  const links: SankeyDataLink[] = SankeyDataLinks.filter(isFullLink).map(
    (link) => ({
      ...link,
      value: +link.value,
    }),
  );

  function* picker(): Generator<string> {
    for (const { source, target } of links) {
      if (source) yield source;
      if (target) yield target;
    }
  }

  const uniqueNodeNames = new Set<string>(picker());

  const nodes = Array.from(uniqueNodeNames, (name) => ({
    name: name,
    category: name.split('@@')[0],
  }));

  return { nodes, links };
};

export const SankeyChart = ({
  width,
  height,
}: SankeyChartProps): JSX.Element | null => {
  const [data, setData] = useState<SankeyData | null>(null);

  useEffect(() => {
    formatData(portfolioDetailStore.sankeyFlowData).then(setData);
  }, []);

  const sankeyGen = useMemo(
    () =>
      makeSankeyFunc({
        width,
        height,
      }),
    [width, height],
  );

  const sankeyResult = useMemo(() => {
    if (!data) return null;

    return sankeyGen(data);
  }, [data, sankeyGen]);

  if (!data || !sankeyResult) return null;

  const { nodes, links } = sankeyResult;

  return (
    <svg width={width} height={height}>
      <SankeyRects
        nodes={nodes}
        colorFunc={colorRectFunc}
        titleFunc={formatRectTitleFunc}
      />
      <SankeyLinks
        links={links}
        colorFunc={colorLinkFunc}
        titleFunc={formatLinkTitleFunc}
      />
      <SankeyLabels nodes={nodes} width={width} />
    </svg>
  );
};

interface ISankeyProps {
  sankeyFlowData: SankeyDataLink[];
}

export const Sankey = observer((props: ISankeyProps): JSX.Element => {
  const [ref, measurements] = useMeasure<HTMLDivElement>();
  const { width } = measurements;

  return (
    // ResizeObserver doesn't work directly on <svg/>
    <div ref={ref}>
      {width > 0 && <SankeyChart width={width} height={600} />}
    </div>
  );
});