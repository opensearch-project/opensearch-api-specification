require 'openapi3_parser'

raise "syntax: validate [spec]" unless ARGV.length >= 1

spec = ARGV[0]
puts "Validating #{spec} ..."

parsed_spec = Openapi3Parser.load_file(spec)
exit 0 if parsed_spec.valid?

parsed_spec.errors.each do |error|
  puts "#{error.context}: #{error}"
end

exit 1