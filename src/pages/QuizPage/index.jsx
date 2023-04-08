import { Img, Text } from "components";
import Footer from "components/Footer";
import Navigationbar from "components/Navigationbar";
import React, { useState } from 'react';
import { Card, Radio, Result, Space } from 'antd';
import { getAllQuiz } from "api/quiz";
import { useEffect } from "react";

const QuizPage = () => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([])
  const [isCorrect, setIsCorrect] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const questionList = await getAllQuiz().then(res => res.result);
      if (questionList) {
        setQuestions(questionList);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (questions) {
      setOptions(
        questions.map(question => [
          { label: question.optionA, value: 'A' },
          { label: question.optionB, value: 'B' },
          { label: question.optionC, value: 'C' },
          { label: question.optionD, value: 'D' },
        ]),
      );
    }
  }, [questions]);

  const handleAnswer = (e) => {
    const answer = e.target.value;
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });

    const isAnswerCorrect = answer === questions[currentQuestion].answer;
    setIsCorrect(isAnswerCorrect);
    setShowExplanation(true);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = null;
      return newAnswers;
    });
    setAnswered(false);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].answer) {
        score += 1;
      }
    }
    return score;
  };

  if (showResult) {
    const score = calculateScore();
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="bg-gradient  flex flex-col font-opensans items-center justify-start mx-[auto] w-[100%]">
        <Navigationbar
          className="flex items-center justify-center md:px-[20px] w-[100%]"
          home="Home"
          picwishone="images/img_picwish2_125x227.png"
        />
        <div className="font-pacifico md:h-[1125px] h-[1379px] max-w-[1660px] mt-[90px] mx-auto p-[129px] md:px-5 relative w-full">

          <div className="absolute bg-gradient1  flex flex-col inset-x-[0] justify-start mx-auto pb-[37px] sm:pr-5 pr-[37px] top-[0] w-[81%]">
            {showResult && (
              <div className="quiz-result">
                <Result
                  status="success"
                  title={`You scored ${percentage}%`}
                  subTitle={`You answered ${score} out of ${totalQuestions} questions correctly.`}
                />
              </div>
            )}
          </div>
        </div>
        <Footer
          className="flex flex-col font-spacegrotesk items-center justify-start mt-[171px] w-full"
          feedback="Feedback"
        />

      </div>
    );
  }
  return (
    <>
      <div className="bg-gradient  flex flex-col font-opensans items-center justify-start mx-[auto] w-[100%]">
        <Navigationbar
          className="flex items-center justify-center md:px-[20px] w-[100%]"
          home="Home"
          picwishone="images/img_picwish2_125x227.png"
        />
        <div className="font-pacifico md:h-[1125px] h-[1379px] max-w-[1660px] mt-[90px] mx-auto p-[129px] md:px-5 relative w-full">

          <div className="absolute bg-gradient1  flex flex-col inset-x-[0] justify-start mx-auto pb-[37px] sm:pr-5 pr-[37px] top-[0] w-[81%]">
            <div className="h-[212px] mr-[933px] relative w-[29%]">
              <Img
                src="images/img_ellipse1.png"
                className="h-[210px] m-auto  w-full"
                alt="ellipseOne"
              />
              <Text
                className="absolute font-normal leading-[54.00px]  not-italic text-center text-gray_900 top-[20%]"
                as="h2"
                variant="h2"
              >
                <>
                  Online Trusty
                  <br />
                  Quiz
                </>
              </Text>
            </div>
            <Card title={`Question ${currentQuestion + 1} of ${questions.length}`} centered="true">
              <p>{questions?.[currentQuestion]?.question}</p>
              <Radio.Group onChange={handleAnswer} value={userAnswers[currentQuestion]}>
                <Space direction="vertical">
                  {options?.[currentQuestion]?.map((option) => (
                    <Radio key={option.value} value={option.value} disabled={answered}>{option.label}</Radio>
                  ))}
                </Space>
              </Radio.Group>
              {showExplanation && (
                <div>
                  <p>{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                  <p>Answer: {questions[currentQuestion].answer}</p>
                  <p>Explanation: {questions[currentQuestion].explanation}</p>
                </div>
              )}
            </Card>
            <div
              className="bg-white_A700 flex h-24 items-center cursor-pointer justify-start md:ml-[0] ml-[1193px] mr-[11px] mt-[122px] pl-0.5 rounded-[50%] w-24"
              style={{ opacity: answered ? 1 : 0, pointerEvents: answered ? 'auto' : 'none' }}>
              <Img onClick={handleNextQuestion}
                src="images/img_arrowright.svg"
                className="h-24 w-auto"
                alt="arrowright"

              />
            </div>
          </div>
        </div>
        <Footer
          className="flex flex-col font-spacegrotesk items-center justify-start mt-[171px] w-full"
          feedback="Feedback"
        />
      </div>
    </>
  );
};

export default QuizPage;
