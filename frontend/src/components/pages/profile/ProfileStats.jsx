import React from 'react'
import { useSelector } from 'react-redux'
import BarsChart from '../../BarsChart'
import LineChart from '../../LineChart'

export default function ProfileStats() {

  const { startedProjects, finishedProjects } = useSelector(state => state.slice.user)

  const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  const dateNow = new Date()
  const thisMonth = dateNow.getUTCMonth() //months from 0-11
  const thisYear = dateNow.getUTCFullYear()

  let lastMonth, yearOfLastMonth, penultimateMonth, yearOfPenultimateMonth
  if (thisMonth === 0) {
    lastMonth = 11
    yearOfLastMonth = thisYear - 1
    penultimateMonth = 10
    yearOfPenultimateMonth = thisYear - 1
  } else if (thisMonth === 1) {
    lastMonth = 1
    yearOfLastMonth = thisYear
    penultimateMonth = 11
    yearOfPenultimateMonth = thisYear - 1
    } else {
    lastMonth = thisMonth - 1
    yearOfLastMonth = thisYear
    penultimateMonth = thisMonth - 2
    yearOfPenultimateMonth = thisYear
  }

  const statsThisMonth = {
    name: months[thisMonth],
    start: Date.parse(new Date(thisYear, thisMonth, 1)),
    year: thisYear,
    startedProjects: [],
    finishedProjects: [],
    earned: 0
  }

  const statsMonthM1 = {
    name: months[lastMonth],
    start: Date.parse(new Date(yearOfLastMonth, lastMonth, 1)),
    year: yearOfLastMonth,
    startedProjects: [],
    finishedProjects: [],
    earned: 0
  }

  const statsMonthM2 = {
    name: months[penultimateMonth],
    start: Date.parse(new Date(yearOfPenultimateMonth, penultimateMonth, 1)),
    year: thisYear,
    startedProjects: [],
    finishedProjects: [],
    earned: 0
  }

  finishedProjects.forEach(project => {
    if (project.finishedAtTS >= statsThisMonth.start) {
      statsThisMonth.finishedProjects.push(project)
    } else if (project.finishedAtTS >= statsMonthM1.start && project.finishedAtTS < statsThisMonth.start) {
      statsMonthM1.finishedProjects.push(project)
    } else if (project.finishedAtTS >= statsMonthM2.start && project.finishedAtTS < statsMonthM1.start) {
      statsMonthM2.finishedProjects.push(project)
    }
  })

  startedProjects.forEach(project => {
    if (project.startedAtTS >= statsThisMonth.start) {
      statsThisMonth.startedProjects.push(project)
    } else if (project.startedAtTS >= statsMonthM1.start && project.startedAtTS < statsThisMonth.start) {
      statsMonthM1.startedProjects.push(project)
    } else if (project.startedAtTS >= statsMonthM2.start && project.startedAtTS < statsMonthM1.start) {
      statsMonthM2.startedProjects.push(project)
    }
  })

  statsThisMonth.earned = statsThisMonth.finishedProjects.reduce((sum, item) => sum + Number(item.budget), 0)
  statsMonthM1.earned = statsMonthM1.finishedProjects.reduce((sum, item) => sum + Number(item.budget), 0)
  statsMonthM2.earned = statsMonthM2.finishedProjects.reduce((sum, item) => sum + Number(item.budget), 0)

  return (
    <>
      <BarsChart
        startedByMonths={[statsMonthM2.startedProjects.length, statsMonthM1.startedProjects.length, statsThisMonth.startedProjects.length]}
        finishedByMonths={[statsMonthM2.finishedProjects.length, statsMonthM1.finishedProjects.length, statsThisMonth.finishedProjects.length]}
        months={[months[thisMonth - 2], months[thisMonth - 1], months[thisMonth]]}
      />
      <LineChart
        earnedByMonths={[statsMonthM2.earned, statsMonthM1.earned, statsThisMonth.earned]}
        months={[months[thisMonth - 2], months[thisMonth - 1], months[thisMonth]]}
      />
    </>
  )
}
