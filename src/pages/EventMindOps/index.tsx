import React, { useState } from 'react';
import { Activity, AlertTriangle, Zap, Database, GitBranch, TrendingUp } from 'lucide-react';
import { Card, Badge, Spinner } from '~/components/ui';
import { useQuery } from '@tanstack/react-query';
import { mockServiceHealth, mockIncidents } from '~/services/mockData';
import { formatRelativeTime } from '~/utils/helpers';

const EventMindOpsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'incidents' | 'kafka' | 'traces'>('overview');

  const { data: serviceHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['service-health'],
    queryFn: async () => mockServiceHealth,
    refetchInterval: 5000,
  });

  const { data: incidents } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => mockIncidents,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'kafka', label: 'Kafka Events', icon: Zap },
    { id: 'traces', label: 'Distributed Traces', icon: GitBranch },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          EventMind AI Operations Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring and AI-powered incident remediation
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              selectedTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Service Health */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Service Health Status</h2>
            {healthLoading ? (
              <Spinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceHealth?.map((service) => (
                  <div key={service.serviceName} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{service.serviceName}</h3>
                      <Badge
                        variant={
                          service.status === 'healthy'
                            ? 'success'
                            : service.status === 'degraded'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                        <span className="font-medium">{service.uptime}%</span>
                      </div>
                      {service.metrics && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">CPU</span>
                            <span className="font-medium">{service.metrics.cpu}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Memory</span>
                            <span className="font-medium">{service.metrics.memory}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Requests</span>
                            <span className="font-medium">{service.metrics.requests}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Services</p>
                  <p className="text-2xl font-bold">5/5</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open Incidents</p>
                  <p className="text-2xl font-bold">{incidents?.filter(i => i.status !== 'resolved').length || 0}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kafka Events/min</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {selectedTab === 'incidents' && (
        <div className="space-y-4">
          {incidents?.map((incident) => (
            <Card key={incident.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold">{incident.title}</h3>
                    <Badge
                      variant={
                        incident.severity === 'critical'
                          ? 'error'
                          : incident.severity === 'high'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={incident.status === 'resolved' ? 'success' : 'warning'}>
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{incident.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {incident.affectedServices.map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              {incident.aiSuggestions && incident.aiSuggestions.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    🤖 AI-Generated Remediation Suggestions
                  </h4>
                  <ul className="space-y-2">
                    {incident.aiSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timeline */}
              <div className="mt-4">
                <h4 className="font-semibold mb-3">Timeline</h4>
                <div className="space-y-2">
                  {incident.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Kafka Events Tab */}
      {selectedTab === 'kafka' && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Kafka Event Stream</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm">order-events</span>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Partition: 0 | Offset: 12,345</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm">payment-events</span>
                <Badge variant="warning">DLQ: 5 messages</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Partition: 2 | Offset: 8,901</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            🚧 Real-time Kafka monitoring integration coming soon
          </p>
        </Card>
      )}

      {/* Distributed Traces Tab */}
      {selectedTab === 'traces' && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Distributed Traces</h2>
          <div className="text-center py-12">
            <GitBranch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              🚧 Distributed tracing visualization coming soon
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Integration with OpenTelemetry and Jaeger in progress
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EventMindOpsPage;
