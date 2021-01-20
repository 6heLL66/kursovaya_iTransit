import React, {useEffect, useState} from "react"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useParams} from "react-router";
import {useRequest} from "../hooks/useRequest.hook";
import ItemsContainer from "../CollectionPage/ItemsContainer";
import ReactLoading from "react-loading";
import Autosuggest from 'react-autosuggest';
import TagsInput from "react-tagsinput";
import {useSelector} from "react-redux";
const languages = require("../languages.json")


function SearchPage() {
    const paramText = useParams().text
    const lang = useSelector(state => state.language)
    const [text, setText] = useState(paramText ? paramText : "")
    const [input, setInput] = useState("")
    const [tags, setTags] = useState([])
    const [allTags, setAllTags] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [result, setResult] = useState([])
    const { request, loading } = useRequest()

    useEffect(() => {
        if (text) findItems().then()
        loadTags().then()
    }, [])

    function suggestionHandler(value) {
        setInput(value)
        if (!value) return
        setSuggestions(allTags.filter(e => {
            let bool = false
            for (let i = 0; i <= e.name.length - value.length; i++) {
                if (e.name.substr(i, value.length) === value) bool = true
            }
            return bool
        }))
    }

    async function loadTags() {
        const data = await request(
            "/api/items/getTags"
        )
        if (data && data.ok) {
            setAllTags(data.tags)
        }
    }

    async function findItems() {
        const data = await request (
            "/api/items/findItems",
            "POST",
            {
                text,
                tags
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            console.log(data)
            setResult(data.items)
        }
    }

    return (
        <Container fluid>
            <Container>
                <Form inline>
                    <Row className={"w-100 p-3 mt-3"} style={{ boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)"}}>
                        <Col xs={8} sm={9} md={10} xl={11}>
                            <Form.Control
                                type="text"
                                value={text}
                                placeholder={languages[lang].header.search}
                                className={"w-100"}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Col>
                        <Col xs={4} sm={3} md={2} lg={1}>
                            <Button variant="outline-info" onClick={findItems}>{languages[lang].header.search}</Button>
                        </Col>
                        <Col xs={8} className={"mt-3"}>
                            <TagsInput
                                renderInput={({ addTag, ...props}) => AutocompleteRenderInput({ addTag, suggestions, ...props })}
                                value={tags}
                                inputProps={{ style: {width: "100%"} }}
                                onChange={(tags) => setTags(tags)}
                                onChangeInput={suggestionHandler}
                                inputValue={input}
                            />
                        </Col>
                    </Row>
                </Form>
            </Container>
            {
                loading ?
                    <Row className="justify-content-md-center">
                        <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                    </Row> :
                    <ItemsContainer items={result} size={2} />
            }
        </Container>
    )
}

function AutocompleteRenderInput({ addTag, suggestions, ...props }) {

    return (
        <Autosuggest
            suggestions={suggestions}
            shouldRenderSuggestions={(value) => value && value.trim().length > 0}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={(e, {suggestion}) => {
                addTag(suggestion.name)
            }}
            inputProps={{ ...props, onChange: props.onChange }}
            onSuggestionsClearRequested={() => {}}
            onSuggestionsFetchRequested={() => {}}
        />
    )
}

function renderSuggestion(suggestion) {
    return (
        <div className={"suggestion"}>
            {suggestion.name}
        </div>
    )
}

export default SearchPage