import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { UserNeed, UserGroup, Entity, WorkflowPhase } from '../types'
import './NetworkGraph.css'

interface NetworkGraphProps {
  userNeeds: UserNeed[]
  userGroups: UserGroup[]
  entities: Entity[]
  workflowPhases: WorkflowPhase[]
}

interface Node extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'userNeed' | 'userGroup' | 'entity' | 'workflowPhase'
  group?: string
  data?: any
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node
  target: string | Node
  type: string
}

function NetworkGraph({ userNeeds, userGroups, entities, workflowPhases }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    // Get container dimensions
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])

    // Create zoom behavior
    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Prepare data
    const nodes: Node[] = []
    const links: Link[] = []

    // Add user need nodes
    userNeeds.forEach(need => {
      nodes.push({
        id: need.id,
        label: need.title,
        type: 'userNeed',
        group: need.userGroupId,
        data: need
      })

      // Link to user group
      links.push({
        source: need.id,
        target: need.userGroupId,
        type: 'belongsTo'
      })

      // Link to workflow phase
      links.push({
        source: need.id,
        target: need.workflowPhase,
        type: 'inPhase'
      })

      // Link to entities
      need.entities.forEach(entityId => {
        links.push({
          source: need.id,
          target: entityId,
          type: 'uses'
        })
      })
    })

    // Add user group nodes
    userGroups.forEach(group => {
      nodes.push({
        id: group.id,
        label: group.name,
        type: 'userGroup',
        data: group
      })
    })

    // Add entity nodes
    entities.forEach(entity => {
      nodes.push({
        id: entity.id,
        label: entity.name,
        type: 'entity',
        data: entity
      })
    })

    // Add workflow phase nodes
    workflowPhases.forEach(phase => {
      nodes.push({
        id: phase.id,
        label: phase.name,
        type: 'workflowPhase',
        data: phase
      })
    })

    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(['userNeed', 'userGroup', 'entity', 'workflowPhase'])
      .range(['#667eea', '#43a047', '#fb8c00', '#e53935'])

    // Create simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.type === 'userNeed' ? 8 : 12)
      .attr('fill', d => color(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })
      .on('mouseover', function() {
        d3.select(this).attr('r', function() {
          const node = d3.select(this.parentNode as SVGGElement).datum() as Node
          return node.type === 'userNeed' ? 10 : 14
        })
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', function() {
          const node = d3.select(this.parentNode as SVGGElement).datum() as Node
          return node.type === 'userNeed' ? 8 : 12
        })
      })

    // Add labels to nodes
    node.append('text')
      .text(d => d.type === 'userNeed' ? d.id : d.label)
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .style('pointer-events', 'none')

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // Click background to deselect
    svg.on('click', () => {
      setSelectedNode(null)
    })

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [userNeeds, userGroups, entities, workflowPhases])

  return (
    <div className="network-graph-container">
      <div className="graph-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#667eea' }}></div>
          <span>User Need</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#43a047' }}></div>
          <span>User Group</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#fb8c00' }}></div>
          <span>Entity</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#e53935' }}></div>
          <span>Workflow Phase</span>
        </div>
        <div className="legend-note">
          Drag nodes to rearrange. Scroll to zoom. Click node for details.
        </div>
      </div>

      <div ref={containerRef} className="graph-canvas">
        <svg ref={svgRef}></svg>
      </div>

      {selectedNode && (
        <div className="node-details">
          <div className="node-details-header">
            <h4>{selectedNode.label}</h4>
            <button onClick={() => setSelectedNode(null)}>×</button>
          </div>
          <div className="node-details-content">
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{selectedNode.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedNode.id}</span>
            </div>
            {selectedNode.type === 'userNeed' && selectedNode.data && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedNode.data.description}</span>
                </div>
                {selectedNode.data.sla && (
                  <div className="detail-row">
                    <span className="detail-label">SLA:</span>
                    <span className="detail-value">{selectedNode.data.sla}</span>
                  </div>
                )}
              </>
            )}
            {selectedNode.data?.description && selectedNode.type !== 'userNeed' && (
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedNode.data.description}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkGraph
