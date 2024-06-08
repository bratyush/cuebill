import { ResponsivePie  } from "@nivo/pie";


export default function PieChart({data}: {data: any[]}) {
  return (
    <>
      <ResponsivePie
        activeOuterRadiusOffset={4}
        animate
        data = {data}
        // height={500}
        legends={[]}
        margin={{
          bottom: 40,
          left: 0,
          right: 0,
          top: 40,
        }}
        colors={{
          datum: 'data.color'
        }}
        theme={{
          // text: {
          //   fontFamily:
          //     "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          // },
        }}
        // width={900}
      />
    </>
  );
}
