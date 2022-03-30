import { Form, Input, InputNumber, Button, Col, Row, Collapse } from "antd"
import { Problem, Method, Data, Task, Explanation, Model, FilterValue, Paper, Venue } from "../types"
import Select from "./Select"
import { fromFilterValue } from "../utils"
import { useAppDispatch, useAppSelector } from "../hooks"
import { formActions } from "../redux"
import { printNames } from "../utils/utils"
import React, { useState, useEffect } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"

const { Item } = Form
const { TextArea } = Input
const { Panel } = Collapse

const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 14,
	},
}


function AddPaperForm() {

	const dispatch = useAppDispatch()
	const form = useAppSelector((state) => state.form)
	const [json, setJson] = useState("")
	useEffect(() => {
		setJson(JSON.stringify(form, null, 2) + ",")
	}, [form])

	function handleChangeTitle(event: React.FormEvent<HTMLInputElement>) {
		dispatch(formActions.setTitle(event.currentTarget.value))
	}

	function handleChangeDoi(event: React.FormEvent<HTMLInputElement>) {
		dispatch(formActions.setDoi(event.currentTarget.value))
	}

	function handleChangeYear(value: number) {
		dispatch(formActions.setYear(value))
	}

	function handleChangeAuthors(event: React.FormEvent<HTMLInputElement>) {
		const authors = event.currentTarget.value.split(",").map((author) => author.trim())
		dispatch(formActions.setAuthors(authors))
	}

	function handleChangeVenueDropdown(value: Array<FilterValue<Venue>>) {
		const newVenue = fromFilterValue(value)[0]
		if (newVenue === "Other") {
			dispatch(formActions.setIsOldVenue(false))
		} else {
			dispatch(formActions.setIsOldVenue(true))
			dispatch(formActions.setVenue(newVenue))
		}
	}

	function handleChangeVenueInput(event: React.FormEvent<HTMLInputElement>) {
		const venue = event.currentTarget.value
		dispatch(formActions.setVenue(venue))
	}

	function handleChangeData(value: Array<FilterValue<typeof Data>>) {
		dispatch(formActions.setData(fromFilterValue(value)))
	}

	function handleChangeProblem(value: Array<FilterValue<typeof Problem>>) {
		dispatch(formActions.setProblem(fromFilterValue(value)))
	}

	function handleChangeModel(value: Array<FilterValue<typeof Model>>) {
		dispatch(formActions.setModel(fromFilterValue(value)))
	}

	function handleChangeTask(value: Array<FilterValue<typeof Task>>) {
		dispatch(formActions.setTask(fromFilterValue(value)))
	}

	function handleChangeExplanation(value: Array<FilterValue<typeof Explanation>>) {
		dispatch(formActions.setExplanation(fromFilterValue(value)))
	}

	function handleChangeMethod(value: Array<FilterValue<typeof Method>>) {
		dispatch(formActions.setMethod(fromFilterValue(value)))
	}

	function handleChangeAbstract(value: React.ChangeEvent<HTMLTextAreaElement>) {
		dispatch(formActions.setAbstract(value.currentTarget.value))
	}

	function handleChangeComment(value: React.ChangeEvent<HTMLTextAreaElement>) {
		dispatch(formActions.setComment(value.currentTarget.value))
	}

	return (
		<Row>
			<Col span={12}>
				<Form {...layout} name="nest-messages" >
					<Item label="Title" tooltip={{ 
						title: "Title of the paper in English",
						icon: <InfoCircleOutlined/>
					}} >
						<Input placeholder="Title" defaultValue={form.Title} onChange={handleChangeTitle} />
					</Item>

					<Item label="Doi-url">
						<Input placeholder="Doi-url" defaultValue={form.url} onChange={handleChangeDoi} />
					</Item>

					<Item label="Year of Publication">
						<InputNumber defaultValue={parseInt(form.Year)} onChange={handleChangeYear} />
					</Item>

					<Item label="Authors" tooltip={{ 
						title: "Firstname Lastname, all names should be separated by a comma",
						icon: <InfoCircleOutlined/>
					}} >
						<Input placeholder="Authors" defaultValue={printNames(form.Authors)} onChange={handleChangeAuthors} />
					</Item>

					<Item label="Venue" tooltip={{ 
						title: "If selecting Other, please use an abbreviation of the complete Venue name similar to the predefined venues.",
						icon: <InfoCircleOutlined/>
					}}>
						<Select placeholder="Venue" enumerator={Venue} handleChange={handleChangeVenueDropdown} value={form.Venue.value ? [form.Venue.value as Venue] : []} maxTags={1} />
					</Item>
					{!form.Venue.isOld 
						? <Item label="Venue" >
							<Input placeholder="Venue" onChange={handleChangeVenueInput} value={form.Venue.value} /> 
						</Item>
						: null
					}

					<Item label="Type of Data" tooltip={{
						title: "What Datatypes the model in the paper uses. A combination of multiple flags is possible.",
						icon: <InfoCircleOutlined/>
					}}>
						<Select placeholder="Type of Data" enumerator={Data} handleChange={handleChangeData} value={form["Type of Data"]} />

					</Item>

					<Item label="Type of Problem">
						<Select placeholder="Type of Problem" enumerator={Problem} handleChange={handleChangeProblem} value={form["Type of Problem"]} />
						<Collapse>
							<Panel header="Info" key="1">
								<p>What type of problems a XAI method can solve are solved in the paper. With at least one of the following flags. These four problem types are based on the taxonomy of Guidotti et. al.[8]</p>

								<p><i>Model Explanation</i>, globally explaining model &#55349;&#56403; through an interpretable, predictive model.</p>

								<p><i>Model Inspection</i>, globally explaining some specific property of model &#55349;&#56403; or its prediction.</p>

								<p><i>Outcome Explanation</i>, explaining an outcome/prediction of &#55349;&#56403; on a particular input instance.</p>

								<p><i>Transparent Box Design</i>, the explanation method is an interpretable model (i.e., &#55349;&#56402; = &#55349;&#56403; ) also making the predictions.</p>
							</Panel>
						</Collapse>
					</Item>

					<Item label="Type of Model to be Explained" tooltip={{
						title: "What type of AI model is used in the paper. A combination of multiple flags is possible.",
						icon: <InfoCircleOutlined/>
					}}>
						<Select placeholder="Type of Model to be Explained" enumerator={Model} handleChange={handleChangeModel} value={form["Type of Model to be Explained"]} />
					</Item>

					<Item label="Type of Task" tooltip={{
						title: "What is the task of the AI model in the paper. A combination of multiple flags is possible.",
						icon: <InfoCircleOutlined/>
					}}>
						<Select placeholder="Type of Task" enumerator={Task} handleChange={handleChangeTask} value={form["Type of Task"]} />
					</Item>

					<Item label="Type of Explanation">
						<Select placeholder="Type of Explanation" enumerator={Explanation} handleChange={handleChangeExplanation} value={form["Type of Explanation"]} />
						<Collapse>
							<Panel header="Info" key="1">
								<p>What type of explanation is used to explain the AI model. A combination of multiple flags is possible.</p>

								<p><i>Decision Rules</i>, Logical rules, including decision sets[16], anchors[24], decision tables[13] and programs[31].</p>

								<p><i>Decision Tree</i>, Rooted graph with conditional statement at each node, e.g. ProtoTree [19].</p>

								<p><i>Disentanglement</i>, Disentangled representation, where each disjoint feature might have a semantic meaning. E.g. InfoGAN [5].</p>

								<p><i>Feature Importance</i>, Set of 1-dimensional non-binary values/scores to indicate feature relevance, feature contribution or attribution. A feature is not necessarily an input feature to predictive model &#55349;&#56403; , but it should be a feature in the explanation. Examples include SHAP[18] and importance scores by LIME[23].</p>

								<p><i>Feature Plot</i>, Plot or figure showing relations or interactions between features or between feature(s) and outcome. Examples include Partial Dependence Plot[7], Individual Conditional Expectation plot[9] and Feature Auditing[1].</p>

								<p><i>Graph</i>, Graphical network structure with nodes and edges, e.g. Abstract Policy Graph[28], Knowledge Graph[32], Flow Graph[25] and Finite State Automata[11].</p>

								<p><i>Heatmap</i>, Map with at least 2 dimensions visually highlighting non-binary feature attribution, activation, sensitivity, attention or saliency. Includes attention maps[26], perturbation masks [6] and Layer-Wise Relevance Propagation [2].</p>

								<p><i>Localization</i>, Binary feature importance. Features can be any type of covariate used in the explanation, such as words, tabular features, or bounding boxes. Examples include binary maps with image patches[23], segmentation[12] and bounding boxes[33].</p>

								<p><i>Prototypes</i>, (Parts of) Representative examples, including concepts[15], influential training instances[10], prototypical parts [4, 19], nearest neighbors and criticisms[14].</p>

								<p><i>Representation Synthesis</i>, Artificially produced visualization to explain representations of the predictive model. Examples include generated data samples[27], Activation Maximization[20] and feature visualization[21].</p>

								<p><i>Representation Visualization</i>, Charts or plots to visualize representations of the predictive model, including visualizations of dimensionality reduction with scatter plots[30], visual cluster analysis[17] and Principal Component Analysis.</p>

								<p><i>Text</i>, Textual explanation via natural language [3, 22]</p>

								<p><i>White-box Model</i>, Intrinsically interpretable models (excluding decision rules). Predictive model &#55349;&#56403; is interpretable and therefore acts as explanation. Examples include a scoring sheet[29] and linear regression. Decision Rules and Decision Trees do not fall into this category, since they are categories on their own.</p>

								<p><i>Other</i>, Explanation that do not fit any other category.</p>
							</Panel>
						</Collapse>
					</Item>

					<Item label="Method used to explain">
						<Select placeholder="Method used to explain" enumerator={Method} handleChange={handleChangeMethod} value={form["Method used to explain"]} />
						<Collapse>
							<Panel header="Info" key="1">
								<p>What method is used to explain the AI model. <br/>
									<i>Post-hoc Explanation Method</i>, Post-hoc explanation methods (also called reverse engineering): explain an already trained predictive model.</p>

								<p><i>Built-in Interpretability</i>, Interpretability built into the predictive model, such as white-box models, attention mechanisms or interpretability constraints (e.g. sparsity) included in the training process of the predictive model.</p>

								<p><i>Supervised Explanation Training</i>, where a ground-truth explanation is provided in order to train the model to output an explanation.</p>

							</Panel>
						</Collapse>
					</Item>

					<Item label="Abstract" tooltip={{ 
						title: "Abstract is optional, but highly recommended",
						icon: <InfoCircleOutlined/>
					}}>
						<TextArea placeholder="Abstract" defaultValue={form["Abstract"]} onChange={handleChangeAbstract} autoSize />
					</Item>

					<Item label="Comment" tooltip={{ 
						title: "Used to indicate that your paper needs to have a new tag for example",
						icon: <InfoCircleOutlined/>
					}}>
						<TextArea placeholder="Comment" defaultValue={form?.Comment} onChange={handleChangeComment} autoSize />
					</Item>
				</Form>
			</Col>
			<Col span={12}>
				<Item label="Your JSON">
					<TextArea value={json} autoSize />
				</Item>
			</Col>
		</Row>

	)
}

export default AddPaperForm
