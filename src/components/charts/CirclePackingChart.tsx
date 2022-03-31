import { useState } from "react"
import { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing"
import { useFilteredPapers } from "../../hooks"
import { Paper } from "../../types"
import { typeArray } from "../../utils"
import { Select, Col } from "antd"

const { Option } = Select

const theme = {
	"textColor": "#ffffff",
	"fontSize": 20,
}

let data: {
	name: string,
	children: any
} = {
	name: "root",
	children: [

	]
}

function GenerateData(columnValue: string) {
	const papers: Paper[] = useFilteredPapers()
	const dataRaw: { [key: string]: { [key: string]: any } } = {
		"Type of Data": {},
		"Type of Problem": {},
		"Type of Model to be Explained": {},
		"Type of Task": {},
		"Type of Explanation": {},
		"Method used to explain": {}
	}

	papers.forEach(function (paper: any) {
		for (const col of typeArray) {
			for (const elem of paper[col]) {
				if (dataRaw[col][elem]) {
					dataRaw[col][elem].push({ name: paper.Title, value: 1, url: paper.url })
				} else {
					dataRaw[col][elem] = []
					dataRaw[col][elem].push({ name: paper.Title, value: 1, url: paper.url })

				}
			}
		}
	})

	data["children"] = []
	for (const [key, value] of Object.entries(dataRaw[columnValue])) {
		data["children"].push({ name: key, children: value })
	}
	console.log(data)
	console.log(dataRaw)

	return data
}

type LineChartProps = {
	type: string
}


function CirclePackingChart({ type }: LineChartProps) {
	function HandleClick(e: any) {
		console.log(e)
		if ("url" in e.data) {
			window.open(e.data.url, "_blank")
		}
	}

	data = GenerateData(type)
	return (
		<div style={{ height: "900px", width: "100%", marginTop: "20px" }}>
			<ResponsiveCirclePackingCanvas
				data={data}
				margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
				id="name"
				colors={{ scheme: "nivo" }}
				childColor={{
					from: "color",
					modifiers: [
						[
							"brighter",
							3
						]
					]
				}}
				labelsSkipRadius={40}
				labelsFilter={label => ((label.label.toString().length / label.node.radius) < 0.35) && !(label.label === "root")}
				padding={5}
				leavesOnly={false}
				enableLabels={true}
				label="id"
				labelTextColor={{
					from: "color",
					modifiers: [
						[
							"darker",
							3
						]
					]
				}}
				borderColor={{
					from: "color",
					modifiers: [
						[
							"darker",
							3
						]
					]
				}}
				animate={false}
				onClick={HandleClick}
				theme={theme}
			/>
		</div>
	)
}

export default CirclePackingChart